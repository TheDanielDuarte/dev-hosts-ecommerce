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

// Info: https://adonisjs.com/docs/4.1/routing#_route_groups
Route
  .group(() => {
    // Info: https://adonisjs.com/docs/4.1/routing#_route_resources
    Route
      .resource('users', 'UserController')
      .except(['index'])
      .middleware(new Map([
        [['update', 'show', 'destroy'], ['auth:jwt', 'checkIfTokenIsBlackListed' , 'findUser', 'userIsCorrect']],
      ]))
      .validator(new Map([
        [['users.store'], ['StoreUser']],
        [['users.update'], ['UpdateUser']]
      ]))

    Route.post('users/login', 'UserController.login').validator(['Login'])
    Route.post('users/refresh-token', 'UserController.refreshToken')
    Route.post('users/logout', 'UserController.logout').middleware(['auth'])

    Route.get('storage-centers', 'StorageCenterController.index')
    Route.get('storage-centers/:id', 'StorageCenterController.show').middleware(['findStorageCenter'])
    
    Route.get('services', 'ServiceController.index')
    Route.get('services/:id', 'ServiceController.show').middleware(['findService'])
    
    Route.get('servers', 'ServerController.index')
    Route.get('servers/:id', 'ServerController.show').middleware(['findServer'])
  })
  .prefix('api')

Route.on('*').render('welcome')
