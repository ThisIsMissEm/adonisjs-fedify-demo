import { defineConfig, ServerOptions } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import env from '#start/env'

// Hack to make vite happy with fedify tunnel, but you really shouldn't do this
// in production:
const serverSettings: ServerOptions = {}
if (env.get('NODE_ENV') !== 'production') {
  serverSettings.allowedHosts = [new URL(env.get('PUBLIC_URL')).host]
}

export default defineConfig({
  server: serverSettings,
  plugins: [
    adonisjs({
      /**
       * Entrypoints of your application. Each entrypoint will
       * result in a separate bundle.
       */
      entrypoints: ['resources/css/app.css', 'resources/js/app.js'],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.edge'],
    }),
  ],
})
