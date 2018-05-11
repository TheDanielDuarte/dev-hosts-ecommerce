'use strict'

const { test, trait, before, after } = use('Test/Suite')('User')
const User = use('App/Models/user')
const Database = use('Database')
let user;

trait('Test/ApiClient')

before(async () => {
  user = await User.create({ 'first-name': 'Daniel', 'last-name': 'Duarte', email: 'danielduarte2004@gmail.com', password: '123456789' })
})

test('It should login a user by sending back a jwt token', async ({ client, assert }) => {
  const response = await client.post('/api/users/login').send({ email: user.email, password: '123456789' }).end()
  response.assertStatus(200)
  assert.exists(response.body.data.token)
})

test('It should not return an error when trying to see a profile of a user that doesn\'t exist', async ({ client, assert }) => {
  const response = await client.get('/api/users/10660540085').end()

  assert.isArray(response.body.errors)
  assert.isTrue(response.body.errors.length >= 1)
  response.assertStatus(404)
  response.assertJSONSubset({
    successfull: false,
    data: null
  })
})

test('It should not return an error when trying to update a user that doesn\'t exist', async ({ client, assert }) => {
  const response = await client.patch('/api/users/10660540').send({ email: 'update@hotmail.com', password: 'updatedpwd' }).end()

  assert.isArray(response.body.errors)
  assert.isTrue(response.body.errors.length >= 1)
  response.assertStatus(404)
  response.assertJSONSubset({
    successfull: false,
    data: null
  })
})

test('It should not return an error when trying to delete a user that doesn\'t exist', async ({ client, assert }) => {
  const response = await client.delete('/api/users/10660540').end()

  assert.isArray(response.body.errors)
  assert.isTrue(response.body.errors.length >= 1)
  response.assertStatus(404)
  response.assertJSONSubset({
    successfull: false,
    data: null
  })
})

test('It should return all Users', async ({ client, assert }) => {
  const response = await client.get('/api/users').end()
  const { $attributes: attributes } = user
  assert.hasAnyKeys(response.body.data[0], attributes)
  response.assertStatus(200)
  response.assertJSONSubset({
    errors: [],
    successfull: true
  })
})

test('It should update a user', async ({ client, assert }) => {
  const response = await client.patch(`/api/users/${user.id}`).send({ email: 'test@yahoo.com' }).end()
  const updatedUser = await User.find(user.id)

  assert.strictEqual(updatedUser.email, 'test@yahoo.com')
  response.assertStatus(200)
  response.assertJSONSubset({
    successfull: true,
    errors: []
  })
})

test('It should create a user', async ({ client, assert }) => {
  const userData = {
    'first-name': 'Julio',
    'last-name': 'Perdomo',
    email: 'julioperdomo@hotmail.com',
    password: '123456789'
  }
  const response = await client.post('/api/users').send(userData).end()
  response.assertStatus(201)

  const createdUser = await User.find(response.body.data.user.id)

  assert.exists(createdUser)

  response.assertJSONSubset({
    errors: [],
    successfull: true,
  })
}).timeout(0)

test('It should show a user profile', async ({ client, assert }) => {
  const response = await client.get(`/api/users/${user.id}`).end()

  response.assertStatus(200)
  assert.hasAnyKeys(response.body.data, user['$attributes'])
  response.assertJSONSubset({
    successfull: true,
    errors: []
  })
})

test('It should delete a user', async ({ client, assert }) => {
  const response = await client.delete(`/api/users/${user.id}`).end()
  const deletedUser = User.find(user.id)
  assert.isEmpty(deletedUser)
  response.assertStatus(200)
  response.assertJSONSubset({
    successfull: true,
    errors: []
  })
})

after(async () => {
  const users = await User.all()
  await Promise.all(users.rows.map(user => user.delete()))
})