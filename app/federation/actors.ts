import { federation } from '#start/federation'
import { Person } from '@fedify/fedify'

federation.setActorDispatcher('/actors/{identifier}', async (ctx, identifier) => {
  if (identifier !== 'me') {
    return null // Other than "me" is not found.
  }

  ctx.data.logger.info('Hello from Fedify')

  return new Person({
    id: ctx.getActorUri(identifier),
    name: 'Me', // Display name
    summary: 'This is me!', // Bio
    preferredUsername: identifier, // Bare handle
    url: new URL('/', ctx.url),
  })
})
