/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const ActorsController = () => import('#controllers/actors_controller')

router.on('/').render('pages/home')
router.get('/actors/:identifier', [ActorsController, 'show'])
