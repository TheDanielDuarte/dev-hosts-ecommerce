'use strict'

const Model = use('Model')

class Service extends Model {
  users () {
    return this.belongsToMany('App/Models/User')
  }

  group () {
    return this.belongsTo('App/Models/GroupOfServices')
  }
}

module.exports = Service
