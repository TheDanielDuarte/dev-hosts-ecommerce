'use strict'

const Model = use('Model')

class Server extends Model {
  users () {
    return this.belongsToMany('App/Models/User')
  }
}

module.exports = Server
