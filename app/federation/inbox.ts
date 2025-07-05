import logger from '@adonisjs/core/services/logger'
import fedify from '@fedify/adonisjs/services/builder'
import { Create, Follow, isActor, Note, Reject } from '@fedify/fedify'

fedify
  .setInboxListeners('/actors/{identifier}/inbox', '/inbox')
  .on(Follow, async (ctx, follow) => {
    if (follow.id === null || follow.actorId === null || follow.objectId === null) {
      return
    }

    const parsed = ctx.parseUri(follow.objectId)
    if (parsed?.type !== 'actor' || parsed.identifier !== 'me') {
      return
    }

    const follower = await follow.getActor(ctx)
    logger.debug(follower)

    if (follower === null) return

    // Note that if a server receives a `Follow` activity, it should reply
    // with either an `Accept` or a `Reject` activity.  In this case, the
    // server automatically accepts the follow request:
    await ctx.sendActivity(
      { identifier: parsed.identifier },
      follower,
      new Reject({ actor: follow.objectId, object: follow })
    )
    // Store the follower in the key–value store:
    // await kv.set(['followers', follow.id.href], follow.actorId.href)
  })
  .on(Create, async (_ctx, create) => {
    const object = await create.getObject()
    if (!(object instanceof Note)) return
    const actor = create.actorId
    if (actor === null) return
    const author = await object.getAttribution()
    if (!isActor(author) || author.id?.href !== actor.href) return

    const content = object.content?.toString()

    logger.info({ content, author }, 'New note!')
  })
