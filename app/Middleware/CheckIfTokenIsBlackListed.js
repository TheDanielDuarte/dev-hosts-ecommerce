'use strict'

const Encryption = use('Encryption')
const BlackListedToken = use('App/Models/BlackListedToken')
const TokenIsBlackListedException = use('App/Exceptions/TokenIsBlackListedException')

class CheckIfTokenIsBlackListed {
  async handle ({ auth }, next) {
    const token = auth.getAuthHeader()
    const tokenInDB = await BlackListedToken.findBy({ token })

    if(tokenInDB) 
      throw new TokenIsBlackListedException('This token is not valid anymore, please check you are logged in', 401)
    
    
    // call next to advance the request
    await next()
  }
}

module.exports = CheckIfTokenIsBlackListed
