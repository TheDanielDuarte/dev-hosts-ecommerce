'use strict'

const { test, trait, beforeEach, afterEach } = use('Test/Suite')('User')
const User = use('App/Models/user')
const Database = use('Database')
const userCredentials = { email: 'test@email.com', password: 'password' }
const Hash = use('Hash')
let user;

trait('Test/ApiClient')
trait('Auth/Client')

beforeEach(async () => {
  user = await User.create({ 
    'first-name': 'Daniel', 
    'last-name': 'Duarte',
    ...userCredentials
  })
})

test('It should return a user\'s profile', async ({ client, assert }) => {
  const response = await client.get(`/api/users/${user.id}`).loginVia(user, 'jwt').end()

  assert.hasAnyKeys(response.body.data, Object.keys(user['$attributes']))
  assert.containsAllKeys(response.body.data, ['servers', 'services', 'data-storage'])
  response.assertStatus(200)
  response.assertJSONSubset({
    successfull: true,
    errors: []
  })
})

test('It shouldn\'t let me see a user profile without authenticating', async ({ client, assert }) => {
  const response = await client.get(`/api/users/${user.id}`).end()

  assert.isNull(response.body.data)
  assert.isFalse(response.body.successfull)
  assert.isArray(response.body.errors)
  assert.isTrue(response.body.errors.length > 0)
  response.assertStatus(401)
})

test('It should let me update my user\'s profile', async ({ client, assert }) => {
  const newEmail = 'another-test@yahoo.com'
  const response = await client
    .patch(`/api/users/${user.id}`)
    .send({ email: newEmail })
    .loginVia(user, 'jwt')
    .end()

  const userUpdated = await User.find(user.id)
  assert.strictEqual(userUpdated.email, newEmail)
  assert.notStrictEqual(userUpdated.email, user.email)
  assert.hasAnyKeys(response.body.data, Object.keys(user['$attributes']))
  assert.containsAllKeys(response.body.data, ['servers', 'services', 'data-storage'])
  response.assertStatus(200)
  response.assertJSONSubset({
    successfull: true,
    errors: []
  })
})

test('It shouldn\'t let me update my user\'s profile without authenticating', async ({ client, assert }) => {
  const newPassword = 'new-password'
  const response = await client
    .patch(`/api/users/${user.id}`)
    .send({ password: newPassword })
    .end()

  
  const userUpdated = await User.find(user.id)
  assert.strictEqual(userUpdated.password, user.password)
  assert.notStrictEqual(userUpdated.password, await Hash.make(newPassword))
  assert.isArray(response.body.errors)
  assert.isTrue(response.body.errors.length > 0)
  assert.isFalse(response.body.successfull)
  response.assertStatus(401)
})

test('It should let me delete my user', async ({ client, assert }) => {
  const response = await client
    .delete(`/api/users/${user.id}`)
    .loginVia(user, 'jwt')
    .end()

  const deletedUser = await User.find(user.id)
  assert.notExists(deletedUser)
  assert.containsAllKeys(response.body.data, ['servers', 'services', 'data-storage'])  
  response.assertStatus(200)
  response.assertJSONSubset({
    successfull: true,
    errors: []
  })
})

test('It shouldn\'t let me delete my user without authenticating', async ({ client, assert }) => {
  const response = await client.delete(`/api/users/${user.id}`).end()
  const deletedUser = await User.find(user.id)

  assert.exists(deletedUser)
  response.assertStatus(401)
  assert.isFalse(response.body.successfull)
  assert.isArray(response.body.errors)
  assert.isTrue(response.body.errors.length > 0)
})

test('It should create a user, and return an auth token back', async ({ client, assert }) => {
  const response = await client
    .post('/api/users')
    .send({ 
      email: 'mynewuser@hotmail.com', 
      password: 'drowssap', 
      'first-name': 'John', 
      'last-name': 'Doe' 
    })
    .end()

  const { id } = response.body.data.user
  const userCreated = await User.find(id)

  assert.exists(userCreated)
  assert.exists(response.body.data.token.token)
  assert.exists(response.body.data.token.refreshToken)
  response.assertStatus(201)
  response.assertJSONSubset({
    successfull: true,
    errors: []
  })

  await userCreated.delete()
}).timeout(0)

afterEach(async () => { 
  await user.delete()
})