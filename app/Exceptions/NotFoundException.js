'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotFoundException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
  handle(error, { response }) {
    response.status(404).json({
      errors: [this.message],
      successfull: false,
      data: null
    })
  }
}

module.exports = NotFoundException
