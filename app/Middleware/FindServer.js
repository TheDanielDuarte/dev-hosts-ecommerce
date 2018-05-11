'use strict'

const Server = use('App/Models/Server')
const NotFoundException = use('App/Exceptions/NotFoundExceptions')

class FindServer {
  async handle ({ request, response, params: { id } }, next) {
    // call next to advance the request
    try {
      const server = await Server.findOrFail(id)
      request.body.server = server
    } catch (error) {
      throw new NotFoundException(`Server with id - ${id} not found`)
    }
    await next()
  }
}

module.exports = FindServer
