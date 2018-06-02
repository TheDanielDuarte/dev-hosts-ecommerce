'use strict'

class UserIsCorrect {
  async handle ({ request, auth, response }, next) {
    // call next to advance the request
    const user = await auth.getUser()
    const { user: userRequested } = request.post()

    if(userRequested.id !== user.id) {
      const method = request.method()
      let message
      switch(method) {
        case 'GET': {
          message = 'see'
          break
        }
        case 'PATCH': {
          message = 'update'
          break
        }
        default: {
          message = 'delete'
        }
      }
      
      response.status(401).json({
        errors: [`You cannot ${message} someone's profile`],
        successful: false,
        data: null
      })
    }
    
    await next()

  }
}

module.exports = UserIsCorrect
