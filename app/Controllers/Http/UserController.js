'use strict'

const User = use('App/Models/User')
const userFields = ['first-name', 'last-name', 'email', 'password', 'role', 'charge-per-month']
const Logger = use('Logger')

class UserController {
  async index () {
    const users = await User.query().with('tokens').fetch()
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
      response
        .status(200)
        .json({
          data: {
            token: jwt
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

  async store ({ request, response }) {
    const data = request.only(userFields)
    const user = await User.create(data)
    return response
      .status(201)
      .json({
        errors: [],
        successfull: true,
        data: user
      })
  }

  async show ({ request, params: { id } }) {
    const { user } = request.post()
    return {
      errors: [],
      successfull: true,
      data: user
    }
  }

  async update ({ request }) {
    const { user } = request.post()
    const fields = userFields.filter(field => !field.includes('role'))
    const data = request.only(fields)
    
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
