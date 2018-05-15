'use strict'

const Encryption = use('Encryption')
const BlackListedToken = use('App/Models/BlackListedToken')
const TokenIsBlackListedException = use('App/Exceptions/TokenIsBlackListedException')

class CheckIfTokenIsBlackListed {
  async handle ({ auth, request }, next) {
    // call next to advance the request
    const token = auth.getAuthHeader()
    const encryptedToken = await Encryption.encrypt(token)
    const tokenInDB = await BlackListedToken.findBy({ token: encryptedToken })

    if(tokenInDB) {
      throw new TokenIsBlackListedException('This token is not valid anymore, please check you are logged in', 401)
    }
    
    await next()
  }
}

module.exports = CheckIfTokenIsBlackListed
