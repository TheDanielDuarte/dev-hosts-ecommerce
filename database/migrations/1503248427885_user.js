'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.increments()
      table.timestamps()
      table.string('first-name', 60).notNullable()
      table.string('last-name', 60).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.decimal('charge-per-month').defaultTo(0.0).unsigned()
      table.string('role').notNullable()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
