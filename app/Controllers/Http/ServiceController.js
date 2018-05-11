'use strict'


const Service = use('App/Models/Service')
const serviceFields = ['name', 'description', 'price-per-month', 'events-per-month', 'history-in-days', 'users', 'concurrent-builds', 'builds-per-day']

class ServiceController {
  async index () {
    const services = await Service.all()
    return {
      successfull: true,
      errors: [],
      data: services
    }
  }

  async store ({ request, response }) {
    const data = request.only(serviceFields)
    const service = await Service.create(data)
    
    response
      .status(201)
      .json({
        successfull: true,
        errors: [],
        data: service
      })
  }

  async show ({ request }) {
    const { service } = request.post()
    return {
      successfull: true,
      errors: [],
      data: service
    }
  }

  async update ({ request }) {
    const { service } = request.post()
    const data = request.only(...serviceFields)

    service.merge(data)

    await service.save()

    return {
      successfull: true,
      errors: [],
      data: service
    }
  }

  async destroy ({ request }) {
    const { service } = request.post()

    await service.delete()

    return {
      successfull: true,
      errors: [],
      data: service
    }
  }
}

module.exports = ServiceController
