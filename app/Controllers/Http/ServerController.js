'use strict'

const Server = use('App/Models/Server')
const serverFields = ['name', 'memory-in-gb', 'cpu', 'storage-in-gb', 'transfer-in-tb', 'price-per-month']

class ServerController {
  async index () {
    const servers = await Server.all()
    return {
      successfull: true,
      errors: [],
      data: servers
    }
  }

  async show ({ request }) {
    const { server } = request.post()
    return {
      successfull: true,
      errors: [],
      data: server
    }
  }
  
  // async store ({ request, response }) {
  //   const data = request.only(serverFields)
  //   const server = await Server.create(data)
  //   return response
  //     .status(201)
  //     .json({
  //       errors: [],
  //       successfull: true,
  //       data: server
  //     })
  // }


  // async update ({ request, response }) {
  //   const { server } = request.post()
  //   const data = request.only(serverFields)

  //   server.merge(data)

  //   await server.save()
    
  //   response.status(201).json({
  //     successfull: true,
  //     errors: [],
  //     data: server
  //   })
  // }

  // async destroy ({ request, response }) {
  //   const { server } = request.post()

  //   await server.delete()

  //   return {
  //     successfull: true,
  //     errors: [],
  //     data: server
  //   }
  // }
}

module.exports = ServerController
