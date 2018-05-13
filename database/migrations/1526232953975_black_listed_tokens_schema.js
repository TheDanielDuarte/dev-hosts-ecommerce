'use strict'

const Schema = use('Schema')

class BlackListedTokensSchema extends Schema {
  up () {
    this.create('black_listed_tokens', (table) => {
      table.increments()
      table.timestamps()
      table.string('token').notNullable()
    })
  }

  down () {
    this.drop('black_listed_tokens')
  }
}

module.exports = BlackListedTokensSchema
