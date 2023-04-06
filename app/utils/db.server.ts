import { PrismaClient } from '@prisma/client'

declare global {
  // This prevents us from making multiple connections to the db when the
  // require cache is cleared.
  // eslint-disable-next-line
  var __prisma: ReturnType<typeof getClient> | undefined
}

const logThreshold = 500

const prisma = () => global.__prisma ?? (global.__prisma = getClient())

function getClient(): PrismaClient {
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is.
  const client = new PrismaClient({
    log: [
      {level: 'query', emit: 'event'},
      {level: 'error', emit: 'stdout'},
      {level: 'info', emit: 'stdout'},
      {level: 'warn', emit: 'stdout'},
    ],
  })
  client.$on('query', async e => {
    if (e.duration < logThreshold) return
    const {default: chalk} = await import('chalk')

    const color =
      e.duration < logThreshold * 1.1
        ? 'green'
        : e.duration < logThreshold * 1.2
        ? 'blue'
        : e.duration < logThreshold * 1.3
        ? 'yellow'
        : e.duration < logThreshold * 1.4
        ? 'redBright'
        : 'red'
    const dur = chalk[color](`${e.duration}ms`)
    console.info(`prisma:query - ${dur} - ${e.query}`)
    console.info(`prisma:binding - ${dur} - ${e.params}`)
  })
  // make the connection eagerly so the first request doesn't have to wait
  void client.$connect()
  return client
}

export default prisma