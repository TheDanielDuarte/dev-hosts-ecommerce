'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotAuthenticatedException extends LogicalException {  }

module.exports = NotAuthenticatedException
