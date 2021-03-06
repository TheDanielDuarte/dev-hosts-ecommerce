'use strict'

const StorageCenter = use('App/Models/StorageCenter')
// const storageCenterFields = ['name', 'short-description', 'storage-in-gb', 'transfer-in-tb', 'price-per-month', 'builds-per-day', 'concurrent-builds']

class StorageCenterController {
  async index () {
    const storageCenters = await StorageCenter.all()
    return {
      errors: [],
      successful: true,
      data: storageCenters
    }
  }

  
  async show ({ request }) {
    const { storageCenter } = request.post()
    return {
      errors: [],
      successful: true,
      data: storageCenter
    }
  }


  // async store ({ request, response }) {
  //   const data = request.only(storageCenterFields)
  //   const storageCenter = await StorageCenter.create(data)

  //   response
  //     .status(201)
  //     .json({
  //       successfull: true,
  //       errors: [],
  //       data: storageCenter
  //     })
  // }


  // async update ({ request, response }) {
  //   const { storageCenter } = request.post()
  //   const data = request.only(storageCenterFields)    

  //   storageCenter.merge(data)

  //   await storageCenter.save()
    
  //   response
  //     .status(201)
  //     .json({
  //       successfull: true,
  //       errors: [],
  //       data: storageCenter
  //     })
  // }

  // async destroy ({ request }) {
  //   const { storageCenter } = request.post()

  //   await storageCenter.delete()

  //   return {
  //     successfull: true,
  //     errors: [],
  //     data: storageCenter
  //   }
  // }
}

module.exports = StorageCenterController
