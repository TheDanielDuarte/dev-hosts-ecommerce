'use strict'

const Model = use('Model')

class Group extends Model {
  services () {
    this.hasMany('App/Models/Services')
  }

  static get table() {
    return 'groups_of_services'
  }
}

module.exports = Group
