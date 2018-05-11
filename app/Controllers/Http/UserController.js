'use strict'

const User = use('App/Models/User')
const userFields = ['first-name', 'last-name', 'email', 'password', 'role', 'charge-per-month']
const Mail = use('Mail')
const NotFoundException = use('App/Exceptions/NotFoundException')

class UserController {
  async index () {
    const users = await User.all()
    return {
      successfull: true,
      errors: [],
      data: users
    }
  }

  async login({ auth, request, response }) {
    const { email, password } = request.post()
    try {
      const jwt = await auth.attempt(email, password)
      const user = await User.findBy({ email })
      response
        .status(200)
        .json({
          data: {
            token: jwt,
            user
          },
          successfull: true,
          errors: []
        })
    } catch (error) {
      return response
        .status(403)
        .json({
          successfull: false,
          errors: [error],
          data: null
        })
    }
  }

  async store ({ request, response, auth }) {
    const data = request.only(userFields)
    const user = await User.create(data)

    const promises = [ auth.generate(user), Mail.send('emails.register', {
        user: {
          ...user,
          firstName: user['first-name'],
          lastName: user['last-name']
        }
      },
      message => {
        message
        .from('daniel@devhosts.com', 'Daniel')
        .to(user.email)
        .subject(`Welcome to DevHosts, ${user['first-name']}`)
      }
    ) ]
    const [ token ] = await Promise.all(promises)

    return response
      .status(201)
      .json({
        errors: [],
        successfull: true,
        data: { user, token }
      })
  }

  async show ({ request }) {
    const { user } = request.post()

    const [ services, servers, storageCenters ] = await Promise.all([
      user.services().fetch(),
      user.servers().fetch(),
      user.storageCenters().fetch()
    ])

    user.services = services
    user.servers = servers
    user['data-storage'] = storageCenters

    return {
      errors: [],
      successfull: true,
      data: user
    }
  }

  async update ({ request }) {
    const { user, services, servers, storage } = request.post()

    const fields = userFields.filter(field => !field.includes('role'))
    const data = request.only(fields)
    
    if(services) {
      await user.services().detach()
      try {
        await user.services().attach(services)
      } catch (error) {
        throw new NotFoundException('Service not found')
      }
    }
    if(servers) {
      await user.servers().detach()
      try {
        await user.servers().attach(servers)
      } catch (error) {
        throw new NotFoundException('Server not found')
      }
    }
    if(storage) {
      await user.storageCenters().detach()
      try {
        await user.storageCenters().attach(storage)
      } catch (error) {
        throw new NotFoundException('Storage center not found')
      }
    }

    user.merge(data)

    await user.save()

    return {
      successfull: true,
      errors: [],
      data: user
    }
  }

  async destroy ({ request }) {
    const { user } = request.post()

    await user.delete()

    return {
      successfull: true,
      data: user,
      errors: []
    }
  }
}

module.exports = UserController
