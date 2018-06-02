'use strict'

class StoreUser {
  get rules () {
    return {
      // validation rules
      'last-name': 'required|max:60',
      'first-name': 'required|max:60',
      email: 'required|email|unique:users,email',
      password: 'required|min:8'
    }
  }

  get validateAll() {
    return true
  }

  get messages() {
    return {
      'email.unique': 'This email\'s already been taken',
      required: '{{ field }} must be filled to create an account',
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
        successful: false,
        errors,
        data: null
      })
  }
}

module.exports = StoreUser
