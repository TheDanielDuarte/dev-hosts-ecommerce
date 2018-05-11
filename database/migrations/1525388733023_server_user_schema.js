'use strict'

const Schema = use('Schema')

class ServerUserSchema extends Schema {
  up () {
    this.create('server_user', (table) => {
      table.increments()
      table.integer('user_id').unsigned().index('user_id')
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      
      table.integer('server_id').unsigned().index('server_id')
      table.foreign('server_id').references('servers.id').onDelete('CASCADE')
    })
  }

  down () {
    this.drop('server_user')
  }
}

module.exports = ServerUserSchema
