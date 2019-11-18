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
