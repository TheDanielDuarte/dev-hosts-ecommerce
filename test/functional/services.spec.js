'use strict'

const { test, trait, beforeEach, afterEach } = use('Test/Suite')('Services')
const User = use('App/Models/User')
const Service = use('App/Models/Service')
let services = []
let user;
const randomNumber = require('random-number')

trait('Test/ApiClient')
trait('Auth/Client')

beforeEach(async () => {
  const service1 = await Service.create({
    name: 'Perpetuate Yellow', 
    'builds-per-day': '50',
    'concurrent-builds': '1', 
    'price-per-month': 100
  })

  const service2 = await Service.create({
    name: 'Perpetuate Green', 
    'builds-per-day': '100',
    'concurrent-builds': 2, 
    'price-per-month': 25
  })

  services.push(service1, service2)

  user = await User.create({
    'first-name': 'Daniel',
    'last-name': 'Duarte',
    email: 'test@email.com',
    password: 'password'
  })
})

test('It should show list all the services', async ({ client, assert }) => {
  const response = await client
    .get('/api/services')
    .end()
  const { successful, data } = response.body

  response.assertStatus(200)
  assert.isTrue(successful)
  assert.isArray(data)
  assert.strictEqual(data.length, 2)
})

test('It should return a single service', async ({ client, assert }) => {
  const index = randomNumber({ integer: true, min: services[0].id, max: services[1].id })
  const response = await client.get(`/api/services/${index}`).end()
  const { successful, data } = response.body
  const service = services[index > services[0].id ? 1 : 0]

  response.assertStatus(200)
  assert.isTrue(successful)
  assert.isNotNull(data)
  assert.containsAllKeys(data, service['$attributes'])
})

test('It should return an error if you try to see a service that does not exist', async ({ client, assert }) => {
  const index = randomNumber({ 
    integer: true, 
    min: services[0].id, 
    max: services[1].id
  })

  const response = await client.get(`/api/services/${index + 2}`).end()
  const { successful, data, errors } = response.body

  response.assertStatus(404)
  assert.isFalse(successful)
  assert.isArray(errors)
  assert.strictEqual(errors[0], `Service with id - ${index + 2} not found`)
  assert.isNull(data)
})

test('It should subscribe a user to a service', async ({ client, assert }) => {
  const [ { id: serviceID1 }, { id: serviceID2 } ] = services
  const response = await client
    .patch(`/api/users/${user.id}`)
    .send({
      services: [serviceID1, serviceID2]
    })
    .loginVia(user, 'jwt')
    .end()
  
  const userServices = await user.services().wherePivot('user_id', user.id).fetch()
  assert.isNotNull(userServices)
  assert.strictEqual(userServices.rows.length, 2)
})

test('It should unsubscribe a user from a service', async ({ client, assert }) => {
  await client
    .patch(`/api/users/${user.id}`)
    .send({
      services: []
    })
    .loginVia(user, 'jwt')
    .end()
  
  const userServices = await user.services().wherePivot('user_id', user.id).fetch()
  assert.isNotNull(userServices)
  assert.strictEqual(userServices.rows.length, 0)
})

test('It should return an error if you try to subscribe to a service that does not exists', async ({ client, assert }) => {
  const [ { id: serviceID1 }, { id: serviceID2 } ] = services
  const response = await client
    .patch(`/api/users/${user.id}`)
    .send({
      services: [serviceID1 + 2, serviceID2 +2 ]
    })
    .loginVia(user, 'jwt')
    .end()
  const { successful, errors, data } = response.body
  const userServices = await user.services().wherePivot('user_id', user.id).fetch()
  
  response.assertStatus(404)
  assert.isFalse(successful)
  assert.isNull(data)
  assert.isNotNull(userServices)
  assert.strictEqual(userServices.rows.length, 0)
  assert.strictEqual(errors[0], 'Service not found')
})

afterEach(async () => {
  await Promise.all(
    services.map(service => service.delete())
  )

  services = []

  await user.delete()
})