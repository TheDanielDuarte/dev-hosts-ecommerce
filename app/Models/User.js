'use strict'

const Hash = use('Hash')
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeCreate', async (userInstance) => {
      if (userInstance.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })

    this.addHook('beforeUpdate', 'UserHook.chargeUser')
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  servers () {
    return this.belongsToMany('App/Models/Server')
  }

  services () {
    return this.belongsToMany('App/Models/Service')
  }

  storageCenters () {
    return this.belongsToMany('App/Models/StorageCenter')
  }

  static get hidden() {
    return ['password']
  }
}

module.exports = User
