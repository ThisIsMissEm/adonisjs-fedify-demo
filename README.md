# Adonis.js Fedify Demo

This is a ROUGH demo showing integration between [Adonis.js Framework](https://adonisjs.com) and [Fedify](https://fedify.dev), allowing for building ActivityPub enabled applications with Adonis.js

For examples, see:
- [`app/federation/actors.ts`](./app/federation/actors.ts)
- [`app/controllers/actors_controller.ts`](./app/controllers/actors_controller.ts)

The main binding logic is in:
- [`app/middleware/fedify_middleware.ts`](./app/middleware/fedify_middleware.ts)
- [`start/federation.ts`](./start/federation.ts)

There's also a little bit of magic module auto-loading happening in [`providers/fedify_provider.ts`](./providers/fedify_provider.ts), but this may be unnecessary with the new [Builder syntax](https://fedify.dev/manual/federation#builder-pattern-for-structuring) in Fedify. The provider essentially works by loading up all the `app/federation/**/*.ts` files after the Adonis.js application has booted.
