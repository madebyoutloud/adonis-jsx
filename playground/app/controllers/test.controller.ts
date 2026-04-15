import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class TestController {
  index({ jsx }: HttpContext) {
    return jsx.render(() => import('#views/index'), { name: 'Adonis' })
  }
}
