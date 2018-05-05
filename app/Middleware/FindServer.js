'use strict'

const Server = use('App/Models/Server')

class FindServer {
  async handle ({ request, response, params: { id } }, next) {
    // call next to advance the request
    try {
      const server = await Server.findOrFail(id)
      request.body.server = server
    } catch (error) {
      response
        .status(404)
        .json({
          errors: [`Server with id - ${id} not found`],
          data: null,
          successfull: false
        })
    }
    await next()
  }
}

module.exports = FindServer
