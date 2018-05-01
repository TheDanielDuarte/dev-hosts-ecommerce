'use strict'

const Schema = use('Schema')

class ServiceUserSchema extends Schema {
  up () {
    this.create('service_user', (table) => {
      table.increments()
      table.timestamps()
      table.integer('user_id').unsigned().index('user_id')
      table.integer('service_id').unsigned().index('service_id')
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.foreign('service_id').references('services.id').onDelete('CASCADE')
    })
  }

  down () {
    this.drop('service_user')
  }
}

module.exports = ServiceUserSchema
