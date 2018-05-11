'use strict'

const Schema = use('Schema')

class GroupsSchema extends Schema {
  up () {
    this.create('groups_of_services', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('description').nullable()
      table.string('subgroup-name').nullable()
      table.string('subgroup-description').nullable()
    })
  }

  down () {
    this.drop('groups_of_services')
  }
}

module.exports = GroupsSchema
