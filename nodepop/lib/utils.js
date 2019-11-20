const util = require('util')
const chalk = require('chalk')
const isDev = process.env.NODE_ENV === 'development'

/**
 * Use util.inspect to print a pretty object
 * @param  {Mixed} obj
 * @return {void}
 */
exports.inspect = obj =>
  util.inspect(obj, {
    depth: 30,
    colors: true,
  })

exports.printDeliverError = ({ code, data, stack, name }) => {
  const debug = require('debug')('root:exception')

  if (isDev) {
    if (stack)
      stack = stack
        .split('\n')
        .slice(1, 4)
        .map(s => s.trim())

    debug(chalk.red.bold(name), exports.inspect({ code, data, stack }))
  } else {
    if (name === 'InternalError') debug(stack)
  }
}

/**
 * Get morgan specific configuration to redirect
 * stream to debug log
 */
exports.getMorganConfig = function() {
  const debug = require('debug')('app:morgan')
  return {
    stream: {
      write(str) {
        debug(str.slice(0, -1))
      },
    },
  }
}
