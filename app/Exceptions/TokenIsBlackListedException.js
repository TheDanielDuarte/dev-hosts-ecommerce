'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class TokenIsBlackListedException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, { response }) {
    response  
      .status(400)
      .json({  
        errors: [this.message],
        successfull: false,
        data: null
      })
  }
}

module.exports = TokenIsBlackListedException
