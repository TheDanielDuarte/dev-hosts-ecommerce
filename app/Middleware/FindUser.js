'use strict'

const User = use('App/Models/User')

class FindUser {
  async handle ({ request, response, params: { id } }, next) {
    // call next to advance the request
    try {
      const user = await User.findOrFail(id)
      request.body.user = user
    } catch (error) {
      response
        .status(404)
        .json({
          errors: [`User with id - ${id} not found`],
          data: null,
          successfull: false
        })
      return
    }
    await next()
  }
}

module.exports = FindUser
