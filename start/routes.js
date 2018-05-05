'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')
const middlewareMap = name => new Map([
  [['update', 'show', 'destroy'], [name]]
])

Route
  .group(() => {
    Route
      .resource('users', 'UserController')
      .middleware(middlewareMap('findUser'))
    Route
      .resource('storage-centers', 'StorageCenterController')
      .middleware(middlewareMap('findStorageCenter'))
    Route
      .resource('services', 'ServiceController')
      .middleware(middlewareMap('findService'))
    Route
      .resource('servers', 'ServerController')
      .middleware(middlewareMap('findServer'))
  })
  .prefix('api')

Route.on('*').render('welcome')
