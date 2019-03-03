function parseProcessArgs () {
  if (process.argv.length < 3) {
    console.error('Missing argument: folder')
    return
  }

  const options = {}
  const args = Object.assign([], process.argv).splice(2)
  options.folderPath = args[0]

  args.forEach((arg, index) => {
    switch (arg) {
      case '-l':
      case '--limit':
        options.limit = index < args.length ? args[index + 1] : 10
        break
      case '-t':
      case '--type':
        options.type = args[index + 1] || 'manga'
        break
    }
  })

  return options
}

/**
 * Log error
 * @param {Error} err
 */
function handleError (err) {
  const {
    message,
    stack
  } = err || {}
  const logger = require('./logger')
  logger.error({
    message,
    stack
  })
  process.exit(1)
}

function formatLapse (millisec) {
  let seconds = (millisec / 1000).toFixed(2)
  let minutes = Math.floor(seconds / 60)
  let hours = 0
  if (minutes > 59) {
    hours = Math.floor(minutes / 60)
    hours = (hours >= 1) ? hours : '0' + hours
    minutes = minutes - (hours * 60)
    minutes = minutes || '0' + minutes
  }

  seconds = Math.round(seconds % 60)
  seconds = seconds || '0' + seconds
  return hours + ':' + minutes + ':' + seconds
}

module.exports = {
  parseProcessArgs,
  handleError,
  formatLapse
}
