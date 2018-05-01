'use strict'

const Model = use('Model')

class StorageCenter extends Model {
  users () {
    return this.belongsToMany('App/Models/User')
  }
}

module.exports = StorageCenter
