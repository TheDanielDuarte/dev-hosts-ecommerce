'use strict'

const Schema = use('Schema')

class StorageCenterSchema extends Schema {
  up () {
    this.create('storage_centers', (table) => {
      table.increments()
      table.timestamps()
      table.string('name').notNullable()
      table.string('short-description').nullable()
      table.integer('storage-in-gb').notNullable()
      table.integer('transfer-in-tb').notNullable()
      table.integer('price-per-month').notNullable()
    })
  }

  down () {
    this.drop('storage_centers')
  }
}

module.exports = StorageCenterSchema
