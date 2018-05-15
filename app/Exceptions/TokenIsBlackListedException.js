'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class TokenIsBlackListedException extends LogicalException { }

module.exports = TokenIsBlackListedException
