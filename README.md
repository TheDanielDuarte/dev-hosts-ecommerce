# Developer Hangout Coding Challenge
## May 2018 - e-commerce backend

*Daniel Duarte* </br>
*For the backend: Adonisjs </br>

##### Routes
- **GET /**  - Welcome page of the application. There are some links to sign up, log in and look at products offered

###### API
Users
- **GET /api/users/:id** - Show a user
- **PATCH /api/users/:id** - Update a user
- **DELETE /api/users/:id** - Delete a user
- **POST /api/users** - Create a user
- **POST /api/users/login** - Login a user using JWT
- **POST /api/users/refresh-token** - Using the refresh token sent back by the server when you logged in, you can ask for another token if the original expired
- **POST /api/users/logout** - Logouts a user with a valid JWT

Servers
- **GET /api/servers** - List all servers
- **GET /api/servers/:id** - Show a server

Storage centers (Data Storage)
- **GET /api/storage-centers** - List all storage centers
- **GET /api/storage-centers/:id** - Show an storage center

Services
- **GET /api/services** - List all services
- **GET /api/services/:id** - Show a service

*It was made with the amazing framework [Adonisjs](https://github.com/adonisjs) and deployed to heroku under the domain <https://devhosts.herokuapp.com> (I picked it at the right time). I structured my data in a very relational way using good old SQL, with all (or almost all) my relationships being many to many. I used them with users and servers, users and services and users and storage centers (data storage). For authentication I chose to use JWTs that expire in 1 hour that also comes with a refresh token (that never expires, but in the moment you logout it will be revoked), so that when the token expires you can send a POST request to /api/users/refresh-token with the payload being:*
```json
  { 
    "refresh-token": "Here goes your refresh token"
  }
```
*And you'll be sent back a new token, without the need to reauthenticate the user with his password and email. The app also uses tons of middleware, exceptions, and some validators to help keep controllers doing just what they're meant to do. The code was tested from its ins and outs, all the routes, middlewares and exceptions.*
*My experience with this project was very good, this was my first real world-ish project, because I started 1 year ago but only learning things, and now this year I'll be putting all the things I learnt in practice. This project was also a surprise because by the time the project was announced I was making my portfolio, and I was thinking of projects that I could make, and that day I decided to check out discord (thing that I rarely do) and found the announcement of this project, and saw it like an opportunitty to get started in the real world, and started doing it, until now that's finished. I learnt a bunch of things, how to use git (I learnt it now because I never felt like I need it), why testing is useful, markdown and some sql.*

#### Some tips
- If you want to log in just send a POST request to /api/users/login formatted like 
```json
  {
    "email": "the email you registered",
    "password": "your password"
  }
```
- All the responses you'll get back from the server will be formatted like 
```json
  {
    "successfull": "A boolean indicating if everything went right",
    "errors": "Either an empty array or an array full of errors",
    "data": "Can be null or an object depending on 'successfull'" 
  }
```
- When your token expires you can send a POST request to /api/users/refresh-token with the refresh token it was sent back to you when you logged in or created your account.
- When a new user is created, a jwt token will be sent back as part of the response so the user doesn't have to login.
- When a new user is created, a welcome email will be sent.
- Due to the form of authentication of the app (using jwt), you'll have to send in each request your credentials in the header. Set the Authorization = Bearer &lt;token&gt; header to authenticate the request.
- When you want to logout send a POST request to /api/users/logout, you don't have to send anything in the payload, you just need to send your jwt token in the headers like any other protected route. (The jwt must be valid)
- The only way that a user can subscribe to a server, service or storage center is to send a PATCH request to /api/users/:id with the payload containing any or all of these fields:
```json
  {
    "services": "An array of services ids",
    "servers": "An array of servers ids",
    "storage": "An array of storage centers ids"
  }
```
- The protected routes are
  - **GET /api/users/:id**
  - **PATCH /api/users/:id**
  - **DELETE /api/users/:id**
  - **POST /api/users/logout**
