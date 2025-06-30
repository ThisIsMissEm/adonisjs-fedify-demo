import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'

const NS_PER_SEC = 1e9
const MS_PER_SEC = 1e6

emitter.on('http:server_ready', () => {
  logger.info(`Server available at: ${env.get('PUBLIC_URL')}`)
})

emitter.on('http:request_completed', ({ ctx, duration }) => {
  const { request, response } = ctx

  // Don't log request for health checks:
  if (request.url() === '/health') {
    return
  }

  // Don't log request for static assets:
  if (
    request.url().startsWith('/resources') ||
    request.url().startsWith('/node_modules') ||
    request.url().startsWith('/@')
  ) {
    return
  }

  const responseTime = (duration[0] * NS_PER_SEC + duration[1]) / MS_PER_SEC

  ctx.logger.info(
    {
      response_time: responseTime,
      status: response.getStatus(),
      query: request.qs(),
    },
    `request ${ctx.request.method()} ${ctx.request.url()} status=${ctx.response.getStatus()} rt=${responseTime}`
  )
})

// For Fedify:
import {
  configure,
  defaultConsoleFormatter,
  getTextFormatter,
  LogLevel,
  LogRecord,
} from '@logtape/logtape'
const levelMap: Record<LogLevel, Function> = {
  trace: logger.trace.bind(logger),
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warning: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger),
}

const formatter = getTextFormatter({
  timestamp: 'disabled',
  level: () => '',
})

await configure({
  sinks: {
    console: (record: LogRecord) => {
      const method = levelMap[record.level]

      if (method === undefined) {
        throw new TypeError(`Invalid log level: ${record.level}.`)
      }
      method(formatter(record).replace(/^\[\]\s+/, ''))
    },
  },
  filters: {},
  loggers: [
    { category: ['logtape', 'meta'], sinks: ['console'] },
    { category: 'fedify', sinks: ['console'] },
  ],
})
