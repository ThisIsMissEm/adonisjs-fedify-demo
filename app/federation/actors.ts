import Actor from '#models/actor'
import { federation } from '#start/federation'
import { Endpoints, exportJwk, generateCryptoKeyPair, importJwk, Person } from '@fedify/fedify'

federation
  .setActorDispatcher('/actors/{identifier}', async (ctx, identifier) => {
    ctx.data.logger.debug('Called setActorDispatcher')
    if (identifier !== 'me') return null

    const actorKeys = await ctx.getActorKeyPairs(identifier)
    return new Person({
      id: ctx.getActorUri(identifier),
      name: 'Me',
      summary: 'This is me!',
      preferredUsername: identifier,
      url: new URL('/', ctx.url),
      inbox: ctx.getInboxUri(identifier),
      endpoints: new Endpoints({
        sharedInbox: ctx.getInboxUri(),
      }),
      // The public keys of the actor; they are provided by the key pairs
      // dispatcher we define below:
      publicKeys: actorKeys.map((keyPair) => keyPair.cryptographicKey),
    })
  })
  .setKeyPairsDispatcher(async (ctx, identifier) => {
    ctx.data.logger.debug('Called setKeyPairsDispatcher')
    if (identifier !== 'me') return [] // Other than "me" is not found.

    const actor = await Actor.findBy('identifier', identifier)
    if (actor === null) {
      // Generate a new key pair at the first time:
      const { privateKey, publicKey } = await generateCryptoKeyPair('RSASSA-PKCS1-v1_5')
      // Store the generated key pair to the Deno KV database in JWK format:
      Actor.create({
        identifier,
        publicKey: await exportJwk(publicKey),
        privateKey: await exportJwk(privateKey),
      })

      return [{ privateKey, publicKey }]
    }

    // Load the key pair from the Deno KV database:
    const privateKey = await importJwk(JSON.parse(actor.privateKey), 'private')
    const publicKey = await importJwk(JSON.parse(actor.publicKey), 'public')
    return [{ privateKey, publicKey }]
  })
