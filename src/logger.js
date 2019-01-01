const winston = require('winston')
const chalk = require('chalk')

function getTimeStamp () {
  return new Date().toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '')
}

function formatMessage (input) {
  const ts = `[${chalk.yellow(getTimeStamp())}]`
  let level = chalk.green(input.level)
  switch (input.level) {
    case 'error':
      level = chalk.red(input.level)
      break
    case 'warn':
      level = chalk.orange(input.level)
      break
    case 'debug':
      level = chalk.yellow(input.level)
  }

  return `${ts} ${level}: ${input.message}
    ${input.stack ? input.stack : ''}`
    .trim()
}

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      maxsize: 1024 * 100,
      maxFiles: 1
    }),
    new winston.transports.File({
      filename: 'info.log',
      level: 'info',
      maxsize: 1024 * 1000,
      maxFiles: 1
    }),
    new winston.transports.Console({
      format: winston.format.printf(formatMessage)
    })
  ]
})

module.exports = logger
