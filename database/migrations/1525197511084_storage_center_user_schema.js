'use strict'

const Schema = use('Schema')

class StorageCenterUserSchema extends Schema {
  up () {
    this.create('storage_center_user', (table) => {
      table.increments()
      table.timestamps()
      table.integer('user_id').unsigned().index('user_id')
      table.integer('storage_id').unsigned().index('storage_id')
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.foreign('storage_id').references('storage_centers.id').onDelete('CASCADE')
    })
  }

  down () {
    this.drop('storage_center_user')
  }
}

module.exports = StorageCenterUserSchema
