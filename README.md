---------------------------------------------------------
# Developer Hangout Coding Challenge
## May 2018 - e-commerce backend

*Daniel Duarte* </br>
*For the backend: Adonisjs, url-parse* </br>
*For the frontend: Angular 6* </br>

##### Routes
- __GET /__  - Welcome page of the application. There are some links to sign up, log in and look at products offered

###### API
Users
- __GET /api/users__ - List all users
- __GET /api/users/:id__ - Show a user
- __PATCH /api/users/:id__ - Update a user
- __DELETE /api/users/:id__ - Delete a user
- __POST /api/users__ - Create a user
- __POST /api/users/login__ - Login a user using JWT
- __POST /api/users/refresh-token__ - Using the refresh token sent back by the server when you logged in, you can ask for another token if the original expired
- __POST /api/users/logout__ - Logouts a user with a valid JWT

Servers
- __GET /api/servers__ - List all servers
- __GET /api/servers/:id__ - Show a server

Storage centers (Data Storage)
- __GET /api/storage-centers__ - List all storage centers
- __GET /api/storage-centers/:id__ - Show an storage center

Services
- __GET /api/services__ - List all services
- __GET /api/services/:id__ - Show a service

###### Frontend

*A brief description of the entire App, including features and how you handled organizing/tracking the data. This is also a good place to reference any issues you had or your general experience*

<!--*DevHosts, a VPS and cloud computing platform, offers a wide variety of products, like your own Servers, cloud storage, and a bunch of services like a load balancer, continous integration...* -->

<!-- --------------------------------------------------------- -->
