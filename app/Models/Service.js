'use strict'

const Model = use('Model')

class Service extends Model {
  users () {
    return this.belongsToMany('App/Models/User')
  }
}

module.exports = Service
