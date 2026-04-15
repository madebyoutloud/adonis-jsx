import type { ApplicationService } from '@adonisjs/core/types'

export interface GlobalState {
  app: ApplicationService
  config: ApplicationService['config']
  [key: string]: unknown
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HttpState {
}
