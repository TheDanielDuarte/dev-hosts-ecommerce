'use strict'

const Schema = use('Schema')

class ServiceSchema extends Schema {
  up () {
    this.create('services', (table) => {
      table.increments()
      table.timestamps()
      table.string('name').notNullable()
      table.string('short-description').nullable()
      table.text('description').nullable()
      table.integer('price').nullable()
      table.integer('events-per-month').nullable()
      table.integer('history').nullable()
      table.integer('users').nullable()
      table.integer('concurrent-builds').nullable()
      table.integer('builds').nullable()
    })
  }

  down () {
    this.drop('services')
  }
}

module.exports = ServiceSchema
