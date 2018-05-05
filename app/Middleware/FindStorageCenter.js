'use strict'

const StorageCenter = use('App/Models/StorageSenter')

class FindStorageCenter {
  async handle ({ request , response }, next) {
    // call next to advance the request
    try {
      const storageCenter = await StorageCenter.findOrFail(id)
      request.body.storageCenter = storageCenter
    } catch (error) {
      return response
        .status(404)
        .json({
          errors: [`Storage Center with id - ${id} not found`],
          data: null,
          successfull: false
        })
    }
    await next()
  }
}

module.exports = FindStorageCenter
