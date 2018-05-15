'use strict'

const Service = use('App/Models/Service')
const NotFoundException = use('App/Exceptions/NotFoundException')
const Logger = use('Logger')

class FindService {
  async handle ({ request, params: { id } }, next) {
    // call next to advance the request
    try {
      const service = await Service.query().where({ id }).with('group').fetch()
      
      if(!(service.rows.length > 0)) throw new NotFoundException(`Service with id - ${id} not found`, 404)

      request.body.service = service.rows[0]
    } catch (error) {
      throw new NotFoundException(`Service with id - ${id} not found`, 404)
    }
    await next()
  }
}

module.exports = FindService
