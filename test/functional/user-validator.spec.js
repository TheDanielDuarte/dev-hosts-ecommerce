'use strict'

const { test, trait, before, after } = use('Test/Suite')('User Validator')
const User = use('App/Models/User')
let user;

trait('Test/ApiClient')

before(async () => {
  user = await User.create({ 'first-name': 'Daniel', 'last-name': 'Duarte', email: 'danielduarte2004@gmail.com', password: '123456789' })
})

trait('Test/ApiClient')

test('It shouldn\'t store a user with an invalid email', async ({ client, assert }) => {
  const response = await client.post('/api/users').send({ email: 'wrong email', password: '97765431821', 'first-name': 'Wrong', 'last-name': 'email'}).end()

  assert.exists(response.body.errors)
  assert.isArray(response.body.errors)
  
  assert.isTrue(response.body.errors.length >= 1)
  response.assertStatus(400)
  response.assertJSONSubset({
    successfull: false,
    data: null
  })
})


test('It shouldn\'t update a user with an invalid email', async ({ client, assert }) => {
  const response = await client.patch(`/api/users/${user.id}`).send({ email: 'wrong email', password: '97765431821', 'first-name': 'Wrong', 'last-name': 'email'}).end()
  assert.exists(response.body.errors)
  assert.isArray(response.body.errors)
  
  assert.isTrue(response.body.errors.length >= 1)
  response.assertStatus(400)
  response.assertJSONSubset({
    successfull: false,
    data: null
  })
})

after(async () => {
  const users = await User.all()
  await Promise.all(users.rows.map(user => user.delete()))
})
