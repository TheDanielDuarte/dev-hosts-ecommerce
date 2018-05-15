'use strict'

const { test, trait, beforeEach, afterEach } = use('Test/Suite')('User')
const User = use('App/Models/user')
const Database = use('Database')
const userCredentials = { email: 'test@email.com', password: 'password' }
const Hash = use('Hash')
const BlackListedToken = use('App/Models/BlackListedToken')
let user

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


test('It should return a token if the login was succesfull', async ({ client, assert }) => {
  const response = await client
    .post('/api/users/login')
    .send(userCredentials)
    .end()
  const { successfull, data: { token: { token, refreshToken } } } = response.body
  response.assertStatus(200)
  assert.isTrue(successfull)
  assert.exists(token)
  assert.exists(refreshToken)
})

test('Using a valid refresh token it should return a new token', async ({ client, assert }) => {
  const loginRequest = await client
    .post('/api/users/login')
    .send(userCredentials)
    .end()

  const { token: authTokens } = loginRequest.body.data
  const response = await client
    .post('/api/users/refresh-token')
    .send({ 
      'refresh-token': authTokens.refreshToken 
    })
    .end()

  const { successfull, data: { refreshToken, token } } = response.body
  response.assertStatus(200)
  assert.isTrue(successfull)
  assert.exists(token)
  assert.strictEqual(refreshToken, authTokens.refreshToken) // It sent the same refreshToken
})

test('It should return an error if you\'re trying to see the profile of user that doesn\'t exists', async({ client, assert }) => {
  const response = await client
    .get(`/api/users/${user.id + 1}`)
    .loginVia(user, 'jwt')
    .end()
  const { successfull, errors, data } = response.body
  response.assertStatus(404)
  assert.isFalse(successfull)
  assert.strictEqual(errors[0], `User with id - ${user.id + 1} not found`)
  assert.isNull(data)
})

test('It shouldn\'t let me see anyone else profile', async ({ client, assert }) => {
  const newUser = await User.create({ email: 'test@gmail.com', password: 'password', 'first-name': 'Camila', 'last-name': 'Fernandez' })
  const response = await client
    .get(`/api/users/${newUser.id}`)
    .loginVia(user, 'jwt') // Note, I'm using the credentials of the user previously created
    .end()

  const { successfull, data, errors } = response.body
  response.assertStatus(401)
  assert.isFalse(successfull)
  assert.isNull(data)
  assert.strictEqual(errors[0], 'You cannot see someone\'s profile')
})

test('It should blacklist a token if a user logs out', async ({ client, assert }) => {
  let blackListedTokensCount = await BlackListedToken.getCount()
  assert.strictEqual(blackListedTokensCount, 0)

  const response = await client
    .post('/api/users/logout')
    .loginVia(user, 'jwt')
    .end()

  const { successfull, data } = response.body
  blackListedTokensCount = await BlackListedToken.getCount()
  assert.strictEqual(blackListedTokensCount, 1)
  response.assertStatus(200)
  assert.isTrue(successfull)
  assert.strictEqual(data.message, 'Logout successfully')
})

test('It shouldn\'t let me access any protected routes if a user logs out', async ({ client, assert }) => {
  const loginResponse = await client
    .post('/api/users')
    .send({ email: 'test@hotmail.com', password: 'password', 'first-name': 'Daniel', 'last-name': 'Duarte' })
    .end()

  const { token: { token } } = loginResponse.body.data
  const userCreated = await User.findBy({ email: 'test@hotmail.com' })

  // Logout user
  const res = await client
    .post('/api/users/logout')
    .header('Authorization', `Bearer ${token}`)
    .end()

  const response = await client
    .get(`/api/users/${userCreated.id}`)
    .header('Authorization', `Bearer ${token}`)
    .end()
  
  const { successfull, data, errors } = response.body
  response.assertStatus(401)
  assert.isFalse(successfull)
  assert.isNull(data)
  assert.strictEqual(errors[0], 'This token is not valid anymore, please check you are logged in')
})

afterEach(async () => { 
  await user.delete()
})