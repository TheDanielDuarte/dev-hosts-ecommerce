'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotAuthenticatedException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, { response }) {
    response
      .status(401)
      .json({
        errors: [this.message],
        successfull: false,
        data: null
      })
  }
}

module.exports = NotAuthenticatedException
