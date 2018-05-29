'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { response, request }) {
    console.log(error)
    if(error.name === 'HttpException') {
      const  [ , ...methodArray ] = error.message.match(/[A-Z]/g)
      const method = methodArray.join('')
      response.status(405)

      response.json({
        errors: [`You cannot send ${method} to ${request.url()}`],
        successfull: false,
        data: null
      })
      
      return
    }

    const [ , message] = error.message.split(`${error.code}: `)

    console.log()
    response.status(error.status).json({
      successfull: false,
      errors: [message || error.message],
      data: null
    })
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler
