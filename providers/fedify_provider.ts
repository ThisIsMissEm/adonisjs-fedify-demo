import type { ApplicationService } from '@adonisjs/core/types'
import { pathToFileURL } from 'node:url'
import fastglob from 'fast-glob'

export default class FedifyProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * The application has been booted
   */
  async start() {
    const federatonDir = this.app.makePath('app', 'federation')
    const files = await fastglob(`${federatonDir}/**/*.ts`)

    for (const file of files) {
      const modulePath = pathToFileURL(file).href

      await import(modulePath)
    }
  }
}
