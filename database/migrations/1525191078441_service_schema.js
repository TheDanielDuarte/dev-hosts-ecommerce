'use strict'

const Schema = use('Schema')

class ServiceSchema extends Schema {
  up () {
    this.create('services', (table) => {
      table.increments()
      table.timestamps()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.integer('price-per-month').nullable()
      table.integer('events-per-month').nullable()
      table.integer('history-in-days').nullable()
      table.integer('users').nullable()
      table.string('concurrent-builds').nullable()
      table.string('builds-per-day').nullable()
    })
  }

  down () {
    this.drop('services')
  }
}

module.exports = ServiceSchema
