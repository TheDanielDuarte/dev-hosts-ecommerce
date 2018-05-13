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
  [['update', 'show', 'delete'], [name]]
])
Route
  .group(() => {
    Route
      .resource('users', 'UserController')
      .middleware(new Map([
        [['update', 'show', 'destroy'], ['auth:jwt', 'checkIfTokenIsBlackListed' , 'findUser', 'userIsCorrect']],
      ]))
      .validator(new Map([
        [['users.store'], ['StoreUser']],
        [['users.update'], ['UpdateUser']]
      ]))
    Route
      .post('users/login', 'UserController.login')
    
    Route.post('users/refresh-token', 'UserController.refreshToken')

    Route.post('users/logout', 'UserController.logout').middleware(['auth'])

    // Route.get('storage-centers', 'StorageCenterController.index')
    // Route.get('storage-centers/:id', 'StorageCenterController.show').middleware(['findStorageCenter'])
    
    // Route.get('services', 'ServiceController.index')
    // Route.get('services/:id', 'ServiceController.show').middleware(['findService'])
    
    // Route.get('servers', 'ServerController.index')
    // Route.get('servers/:id', 'ServerController.show').middleware(['findServer'])
    
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
