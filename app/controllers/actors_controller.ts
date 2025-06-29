import type { HttpContext } from '@adonisjs/core/http'
import { isActor } from '@fedify/fedify'

export default class ActorsController {
  async show({ response, params, view, federation, logger }: HttpContext) {
    if (params.identifier.includes('@')) {
      const actor = await federation.lookupObject(`acct:${params.identifier.replace(/^@/, '')}`)
      logger.debug({ actor: actor })

      if (isActor(actor)) {
        return view.render('pages/actors/show', { identifier: params.identifier, name: actor.name })
      }

      response.abort(`Actor not found: ${params.identifier}`)
    }

    return view.render('pages/actors/show', {
      identifier: params.identifier,
      name: params.identifier,
    })
  }
}
