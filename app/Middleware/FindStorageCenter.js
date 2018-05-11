'use strict'

const StorageCenter = use('App/Models/StorageCenter')
const NotFoundException = use('App/Exceptions/NotFoundException')

class FindStorageCenter {
  async handle ({ request , response, params: { id } }, next) {
    // call next to advance the request
    try {
      const storageCenter = await StorageCenter.findOrFail(id)
      request.body.storageCenter = storageCenter
    } catch (error) {
      throw new NotFoundException(`Storage Center with id - ${id} not found`)
    }
    await next()
  }
}

module.exports = FindStorageCenter
