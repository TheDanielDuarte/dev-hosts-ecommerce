'use strict'

const { test, trait, beforeEach, afterEach } = use('Test/Suite')('Servers')
const User = use('App/Models/User')
const Server = use('App/Models/Server')
let servers = []
let user;
const randomNumber = require('random-number')

trait('Test/ApiClient')
trait('Auth/Client')

beforeEach(async () => {
  const server1 = await Server.create({
    name: 'Lynx', 
    'memory-in-gb': 1, 
    'cpu': 1, 
    'storage-in-gb': 25, 
    'transfer-in-tb': 1, 
    'price-per-month': 15 
  })

  const server2 = await Server.create({
    name: 'Puma', 
    'memory-in-gb': 2, 
    'cpu': 1, 
    'storage-in-gb': 50, 
    'transfer-in-tb': 2, 
    'price-per-month': 25
  })

  servers.push(server1, server2)

  user = await User.create({
    'first-name': 'Daniel',
    'last-name': 'Duarte',
    email: 'test@email.com',
    password: 'password'
  })
})

test('It should show list all the servers', async ({ client, assert }) => {
  const response = await client
    .get('/api/servers')
    .end()
  const { successfull, data } = response.body

  assert.isTrue(successfull)
  response.assertStatus(200)
  assert.isArray(data)
  assert.strictEqual(data.length, 2)
})

test('It should return a single server', async ({ client, assert }) => {
  const index = randomNumber({ integer: true, min: servers[0].id, max: servers[1].id })
  const response = await client.get(`/api/servers/${index}`).end()
  const { successfull, data } = response.body
  const server = servers[index > servers[0].id ? 1 : 0]

  response.assertStatus(200)
  assert.isTrue(successfull)
  assert.isNotNull(data)
  assert.containsAllKeys(data, server['$attributes'])
})

test('It should return an error if you\'re trying to see a server that does not exist', async ({ client, assert }) => {
  const index = randomNumber({ 
    integer: true, 
    min: servers[0].id, 
    max: servers[1].id
  })

  const response = await client.get(`/api/servers/${index + 2}`).end()
  const { successfull, data, errors } = response.body

  response.assertStatus(404)
  assert.isFalse(successfull)
  assert.isArray(errors)
  assert.strictEqual(errors[0], `Server with id - ${index + 2} not found`)
  assert.isNull(data)
})

test('It should subscribe a user to a server', async ({ client, assert }) => {
  const [ { id: serverID1 }, { id: serverID2 } ] = servers
  const response = await client
    .patch(`/api/users/${user.id}`)
    .send({
      servers: [serverID1, serverID2]
    })
    .loginVia(user, 'jwt')
    .end()
  
  const userServers = await user.servers().wherePivot('user_id', user.id).fetch()
  assert.isNotNull(userServers)
  assert.strictEqual(userServers.rows.length, 2)
})

test('It should unsubscribe a user from a server', async ({ client, assert }) => {
  await client
    .patch(`/api/users/${user.id}`)
    .send({
      servers: []
    })
    .loginVia(user, 'jwt')
    .end()
  
  const userServers = await user.servers().wherePivot('user_id', user.id).fetch()
  assert.isNotNull(userServers)
  assert.strictEqual(userServers.rows.length, 0)
})

test('It should return an error if you try to subscribe to a server that does not exists', async ({ client, assert }) => {
  const [ { id: serverID1 }, { id: serverID2 } ] = servers
  const response = await client
    .patch(`/api/users/${user.id}`)
    .send({
      servers: [serverID1 + 2, serverID2 +2 ]
    })
    .loginVia(user, 'jwt')
    .end()
  const { successfull, errors, data } = response.body
  const userServers = await user.servers().wherePivot('user_id', user.id).fetch()
  
  response.assertStatus(404)
  assert.isFalse(successfull)
  assert.isNull(data)
  assert.isNotNull(userServers)
  assert.strictEqual(userServers.rows.length, 0)
  assert.strictEqual(errors[0], 'Server not found')
})

afterEach(async () => {
  await Promise.all(
    servers.map(server => server.delete())
  )

  servers = []

  await user.delete()
})