import { defineConfig } from '@fedify/adonisjs'
import env from '#start/env'

const domain = env.get('DOMAIN')

export default defineConfig({
  origin:
    typeof domain === 'string'
      ? {
          handleHost: domain,
          webOrigin: env.get('PUBLIC_URL'),
        }
      : env.get('PUBLIC_URL'),
})
