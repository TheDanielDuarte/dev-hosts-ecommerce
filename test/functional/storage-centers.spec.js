'use strict'

const { test, trait, beforeEach, afterEach } = use('Test/Suite')('Storage Center')
const User = use('App/Models/User')
const StorageCenter = use('App/Models/StorageCenter')
let storageCenters = []
let user;
const randomNumber = require('random-number')

trait('Test/ApiClient')
trait('Auth/Client')

beforeEach(async () => {
  const storageCenter1 = await StorageCenter.create({
    name: 'Blue Store', 
    'storage-in-gb': 250,
    'transfer-in-tb': 1,
    'price-per-month': 25
  })

  const storageCenter2 = await StorageCenter.create({
    name: 'Red Store', 
    'storage-in-gb': 500,
    'transfer-in-tb': 5,
    'price-per-month': 75
  })

  storageCenters.push(storageCenter1, storageCenter2)

  user = await User.create({
    'first-name': 'Daniel',
    'last-name': 'Duarte',
    email: 'test@email.com',
    password: 'password'
  })
})

test('It should show list all the storage centers', async ({ client, assert }) => {
  const response = await client
    .get('/api/storage-centers')
    .end()
  const { successfull, data } = response.body

  response.assertStatus(200)
  assert.isTrue(successfull)
  assert.isArray(data)
  assert.strictEqual(data.length, 2)
})

test('It should return a single storage center', async ({ client, assert }) => {
  const index = randomNumber({ integer: true, min: storageCenters[0].id, max: storageCenters[1].id })
  const response = await client.get(`/api/storage-centers/${index}`).end()
  const { successfull, data } = response.body
  const storageCenter = storageCenters[index > storageCenters[0].id ? 1 : 0]

  response.assertStatus(200)
  assert.isTrue(successfull)
  assert.isNotNull(data)
  assert.containsAllKeys(data, storageCenter['$attributes'])
})

test('It should return an error if you try to see a storage center that does not exist', async ({ client, assert }) => {
  const index = randomNumber({ 
    integer: true, 
    min: storageCenters[0].id, 
    max: storageCenters[1].id
  })

  const response = await client.get(`/api/storage-centers/${index + 2}`).end()
  const { successfull, data, errors } = response.body

  response.assertStatus(404)
  assert.isFalse(successfull)
  assert.isArray(errors)
  assert.strictEqual(errors[0], `Storage Center with id - ${index + 2} not found`)
  assert.isNull(data)
})

test('It should subscribe a user to a storage center', async ({ client, assert }) => {
  const [ { id: storageCenterID1 }, { id: storageCenterID2 } ] = storageCenters
  const response = await client
    .patch(`/api/users/${user.id}`)
    .send({
      'storage': [storageCenterID1, storageCenterID2]
    })
    .loginVia(user, 'jwt')
    .end()
  
  const userStorageCenters = await user.storageCenters().wherePivot('user_id', user.id).fetch()
  assert.isNotNull(userStorageCenters)
  assert.strictEqual(userStorageCenters.rows.length, 2)
})

test('It should unsubscribe a user from a storage center', async ({ client, assert }) => {
  await client
    .patch(`/api/users/${user.id}`)
    .send({
      storageCenters: []
    })
    .loginVia(user, 'jwt')
    .end()
  
  const userStorageCenters = await user.storageCenters().wherePivot('user_id', user.id).fetch()
  assert.isNotNull(userStorageCenters)
  assert.strictEqual(userStorageCenters.rows.length, 0)
})

test('It should return an error if you try to subscribe to an storage center that does not exist', async ({ client, assert }) => {
  const [ { id: storageCenterID1 }, { id: storageCenterID2 } ] = storageCenters
  const response = await client
    .patch(`/api/users/${user.id}`)
    .send({
      'storage': [storageCenterID1 + 2, storageCenterID2 +2 ]
    })
    .loginVia(user, 'jwt')
    .end()
  const { successfull, errors, data } = response.body
  const userStorageCenters = await user.storageCenters().wherePivot('user_id', user.id).fetch()
  
  response.assertStatus(404)
  assert.isFalse(successfull)
  assert.isNull(data)
  assert.isNotNull(userStorageCenters)
  assert.strictEqual(userStorageCenters.rows.length, 0)
  assert.strictEqual(errors[0], 'Storage center not found')
})

afterEach(async () => {
  await Promise.all(
    storageCenters.map(storageCenter => storageCenter.delete())
  )

  storageCenters = []

  await user.delete()
})