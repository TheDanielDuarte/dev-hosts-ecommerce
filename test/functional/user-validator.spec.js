'use strict'

const { test, trait, beforeEach, afterEach } = use('Test/Suite')('User Validator')
const User = use('App/Models/User')
const Hash = use('Hash')
let user;

trait('Test/ApiClient')
trait('Auth/Client')

beforeEach(async () => {
  user = await User.create({  
    'first-name': 'Daniel',
    'last-name': 'Duarte',
    email: 'test@email.com',
    password: 'drowssap'
  })
})

test('It shouldn\'t let me update a user with an invalid email', async ({ client, assert }) => { 
  const response = await client.patch(`/api/users/${user.id}`).loginVia(user, 'jwt').send({ email: 'wrong-email' }).end()
  const updatedUser = await User.find(user.id)

  assert.notStrictEqual(updatedUser.email, 'wrong-email')
  response.assertStatus(400)
  assert.isFalse(response.body.successful)
  assert.isArray(response.body.errors)
  assert.isTrue(response.body.errors.length > 0)
})

test('It shouldn\'t let me update a user with an invalid password', async ({ client, assert }) => { 
  const response = await client.patch(`/api/users/${user.id}`).loginVia(user, 'jwt').send({ password: '123' }).end() // Too short, must be at least 8 characters long
  const updatedUser = await User.find(user.id)
  
  response.assertStatus(400)
  assert.notStrictEqual(updatedUser.password, await Hash.make('123'))
  assert.isFalse(response.body.successful)
  assert.isArray(response.body.errors)
  assert.isTrue(response.body.errors.length > 0)
})

test('It shouldn\'t let me create a user if I miss at least 1 field', async ({ client, assert }) => { 
  const response = await client
    .post(`/api/users`)
    .send({ 'email': 'test@hotmail.com', 'password': '87654321' })
    .end() // Without 'first-name', nor 'last-name'

  assert.strictEqual(await User.getCount(), 1) // It didn't create any user
  response.assertStatus(400)
  assert.isFalse(response.body.successful)
  assert.isArray(response.body.errors)
  assert.isTrue(response.body.errors.length > 0)
})


test('It shouldn\'t let me create a user with an email already used ', async ({ client, assert }) => { 
  const response = await client
    .post(`/api/users`)
    .send({ email: 'test@email.com', 'first-name': 'test', 'last-name': '2nd', password: '9876543210' })
    .end()
  
  response.assertStatus(400)
  assert.isFalse(response.body.successful)
  assert.isArray(response.body.errors)
  assert.isTrue(response.body.errors.length > 0)
})

afterEach(async () => {
  await user.delete()
})