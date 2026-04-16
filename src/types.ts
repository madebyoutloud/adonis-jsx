import type { ApplicationService } from '@adonisjs/core/types'
import type { HttpRequest } from '@adonisjs/core/http'

export interface GlobalState {
  app: ApplicationService
  config: ApplicationService['config']
  [key: string]: unknown
}

export interface HttpState extends GlobalState {
  request: HttpRequest
}
