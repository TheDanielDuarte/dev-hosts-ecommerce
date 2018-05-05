'use strict'

const Schema = use('Schema')

class ServerUserSchema extends Schema {
  up () {
    this.create('server_users', (table) => {
      table.increments()
      table.timestamps()
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('users.id')
      
      table.integer('server_id').unsigned()
      table.foreign('server_id').references('servers.id')
    })
  }

  down () {
    this.drop('server_users')
  }
}

module.exports = ServerUserSchema
