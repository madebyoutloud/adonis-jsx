import type { HttpContext } from '@adonisjs/core/http'

export default class TestController {
  index({ jsx }: HttpContext) {
    return jsx.render(() => import('#views/index'), { name: 'Adonis' })
  }
}
