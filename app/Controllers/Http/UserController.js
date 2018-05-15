'use strict'

const User = use('App/Models/User')
const Mail = use('Mail')
const NotFoundException = use('App/Exceptions/NotFoundException')
const NotAuthenticatedException = use('App/Exceptions/NotAuthenticatedException')
const BlackListedToken = use('App/Models/BlackListedToken')
const userFields = ['first-name', 'last-name', 'email', 'password', 'charge-per-month']

class UserController {
  // async index () {
  //   const users = await User.all()
  //   return {
  //     successfull: true,
  //     errors: [],
  //     data: users
  //   }
  // }

  async login({ auth, request, response }) {
    const { email, password } = request.post()
    try {
      const jwt = await auth.withRefreshToken().attempt(email, password)
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
      throw new NotAuthenticatedException(error, 401)
    }
  }

  async refreshToken({ auth, request }) {
    const refreshToken = request.input('refresh-token')
    try {
      const token = await auth.generateForRefreshToken(refreshToken)
      return {
        successfull: true,
        errors: [],
        data: token
      }
    } catch (error) {
      const [ , message ] = error.message.split(`${error.code}: `)
      throw new NotAuthenticatedException(message, 401)
    }
  }

  async logout({ auth }) {
    const user = await auth.getUser()
    const token = auth.getAuthHeader()
    await auth.revokeTokensForUser(user)

    await BlackListedToken.create({ token })

    return {
      successfull: true,
      errors: [],
      data: {
        message: 'Logout successfully'
      }
    }
  }

  async store ({ request, response, auth }) {
    const data = request.only(userFields.filter(field => !field.includes('charge-per-month')))
    const user = await User.create(data)

    const promises = [ 
    auth.withRefreshToken().generate(user), 
    Mail.send('emails.register', {
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
  ) 
    ]

    const [ token ] = await Promise.all(promises)

    return response
      .status(201)
      .json({
        errors: [],
        successfull: true,
        data: { user, token }
      })
  }

  async show ({ request, auth }) {
    const { user } = request.post()

    const [ services, servers, storageCenters ] = await Promise.all([
      user.services().with('group').fetch(),
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
        throw new NotFoundException('Service not found', 404)
      }
    }
    if(servers) {
      await user.servers().detach()
      try {
        await user.servers().attach(servers)
      } catch (error) {
        throw new NotFoundException('Server not found', 404)
      }
    }
    if(storage) {
      await user.storageCenters().detach()
      try {
        await user.storageCenters().attach(storage)
      } catch (error) {
        throw new NotFoundException('Storage center not found', 404)
      }
    }

    const [ userServices, userServers, userStorageCenters ] = await Promise.all([
      user.services().with('group').fetch(),
      user.servers().fetch(),
      user.storageCenters().fetch()
    ])

    user.merge(data)

    await user.save()

    user.services = userServices
    user.servers = userServers
    user['data-storage'] = userStorageCenters

    return {
      successfull: true,
      errors: [],
      data: user
    }
  }

  async destroy ({ request }) {
    const { user } = request.post()

    const [ services, servers, storageCenters ] = await Promise.all([
      user.services().fetch(),
      user.servers().fetch(),
      user.storageCenters().fetch()
    ])

    user.servers = servers
    user.services = services
    user['data-storage'] = storageCenters

    await user.delete()

    return {
      successfull: true,
      errors: [],
      data: user
    }
  }
}

module.exports = UserController
