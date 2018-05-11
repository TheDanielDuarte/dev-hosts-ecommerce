'use strict'

const Model = use('Model')

class Service extends Model {
  users () {
    return this.belongsToMany('App/Models/User')
  }

  group () {
    return this.belongsTo('App/Models/GroupOfServices')
  }

  static get hidden() {
    return ['group_id']
  }
}

module.exports = Service
