'use strict'

const Schema = use('Schema')

class GroupsSchema extends Schema {
  up () {
    this.create('groups_of_services', (table) => {
      table.increments()
      table.timestamps()
      table.string('name').notNullable()
      table.string('description').notNullable()
    })
  }

  down () {
    this.drop('groups_of_services')
  }
}

module.exports = GroupsSchema
