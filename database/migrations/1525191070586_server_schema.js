'use strict'

const Schema = use('Schema')

class ServerSchema extends Schema {
  up () {
    this.create('servers', (table) => {
      table.increments()
      table.timestamps()
      table.string('name').notNullable()
      table.integer('memory-in-gb').unsigned()
      table.integer('cpu').unsigned()
      table.integer('storage-in-gb').notNullable()
      table.integer('transfer-in-tb').unsigned()
      table.integer('price-per-month').notNullable()
    })
  }

  down () {
    this.drop('servers')
  }
}

module.exports = ServerSchema
