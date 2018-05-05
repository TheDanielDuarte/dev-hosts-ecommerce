'use strict'

const Service = use('App/Models/Service')

class FindService {
  async handle ({ request }, next) {
    // call next to advance the request
    try {
      const service = await service.findOrFail(id)
      request.body.service = service
    } catch (error) {
      response
        .status(404)
        .json({
          errors: [`Service with id - ${id} not found`],
          data: null,
          successfull: false
        })
    }
    await next()
  }
}

module.exports = FindService
