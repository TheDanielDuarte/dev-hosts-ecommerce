'use strict'

class UpdateUser {
  get rules () {
    return {
      'last-name': 'max:60',
      'first-name': 'max:60',
      email: 'email|unique:users,email',
      password: 'min:8'
    }
  }

  get validateAll() {
    return true
  }

  get messages() {
    return {
      'email.unique': 'This email\'s already been taken',
      max(field, validation, args) {
        const sanitizedField = field.replace(/-/g, ' ')
        return `Your ${sanitizedField} is too large! Your ${sanitizedField} must be maximun ${args[0]} characters long`
      },
      'password.min'(field, validation, args) {
        return `Your password must be at least ${args[0]} characters long`
      },
      email: 'This is not a valid email'
    }
  }

  async fails(errors) {
    return this.ctx.response
      .status(400)
      .json({
        errors,
        data: null,
        successfull: false
      })
  }


}

module.exports = UpdateUser
