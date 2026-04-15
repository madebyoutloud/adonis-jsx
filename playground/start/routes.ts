/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const TestController = () => import('../app/controllers/test.controller.js')

router.get('/', [TestController, 'index'])
