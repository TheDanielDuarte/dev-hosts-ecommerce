'use strict'

const Encryption = use('Encryption')
const BlackListedToken = use('App/Models/BlackListedToken')
const TokenIsBlackListedException = use('App/Exceptions/TokenIsBlackListedException')

class CheckIfTokenIsBlackListed {
  async handle ({ auth, request }, next) {
    // call next to advance the request
    const token = auth.getAuthHeader()
    const encryptedToken = await Encryption.encrypt(token)

    if(BlackListedToken.findBy({ token: encryptedToken })) {
      throw new TokenIsBlackListedException('This token is not valid anymore, please check you are logged in')
    }
    
    await next()
  }
}

module.exports = CheckIfTokenIsBlackListed
