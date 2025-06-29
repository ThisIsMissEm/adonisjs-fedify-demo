import { createFederation, MemoryKvStore } from '@fedify/fedify'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'

export type Context = {
  logger: HttpContext['logger']
}

export const federation = createFederation<Context>({
  origin: env.get('PUBLIC_URL'),
  kv: new MemoryKvStore(),
})
