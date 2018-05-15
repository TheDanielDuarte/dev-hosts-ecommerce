'use strict'

const Server = use('App/Models/Server')
const NotFoundException = use('App/Exceptions/NotFoundException')

class FindServer {
  async handle ({ request, params: { id } }, next) {
    // call next to advance the request
    try {
      const server = await Server.findOrFail(id)
      request.body.server = server
    } catch (error) {
      throw new NotFoundException(`Server with id - ${id} not found`, 404)
    }
    await next()
  }
}

module.exports = FindServer
