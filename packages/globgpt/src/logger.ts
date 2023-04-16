import { inspect } from 'node:util'

const LOG_LEVELS = ['DEBUG', 'VERBOSE', 'INFO', 'WARN', 'ERROR'] as const
export type LogLevel = typeof LOG_LEVELS[number]
export const DEFAULT_LOG_LEVEL: LogLevel = 'INFO'
let LOG_LEVEL: LogLevel

export function setLogLevel() {
  if (process.env.DEBUG?.includes('globgpt'))
    LOG_LEVEL = 'DEBUG'

  else
    LOG_LEVEL = DEFAULT_LOG_LEVEL
}

export function log(level: LogLevel = 'INFO', data: unknown) {
  LOG_LEVEL || setLogLevel()

  const levelIndex = LOG_LEVELS.indexOf(level)
  const logLevelIndex = LOG_LEVELS.indexOf(LOG_LEVEL)

  if (levelIndex >= logLevelIndex) {
    typeof data === 'string'
      ? console.log(data)
      : console.log(inspect(data, { depth: 5 }))
  }
}
