'use strict'

const Service = use('App/Models/Service')
const NotFoundException = use('App/Exceptions/NotFoundException')

class FindService {
  async handle ({ request, params: { id } }, next) {
    // call next to advance the request
    try {
      const service = await Service.query().where({ id }).with('group').fetch()
      
      if(!service) throw new NotFoundException(`Service with id - ${id} not found`)

      request.body.service = service
    } catch (error) {
      throw new NotFoundException(`Service with id - ${id} not found`)
    }
    await next()
  }
}

module.exports = FindService
