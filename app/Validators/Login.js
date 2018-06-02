'use strict'

class Login {
  get rules () {
    return {
      email: 'required|email',
      password: 'required|min:8'
    }
  }

  get validateAll() {
    return true;
  }

  get messages() {
    return {
      required: '{{ field }} must be filled to login into your account',
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
        successfull: false,
        errors,
        data: null
      })
  }
}

module.exports = Login
