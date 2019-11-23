const expressDeliver = require('express-deliver')

const { ValidationError } = require('mongoose').Error
const _ = require('lodash')

module.exports = new expressDeliver.ExceptionPool({
  NoDatabase: {
    code: 1100,
    message: 'No database connection',
  },
  InvalidCredentials: {
    code: 2001,
    statusCode: 403,
    message: 'Invalid credentials supplied',
  },
  Unauthorized: {
    code: 2002,
    statusCode: 401,
    message: 'Unauthorized',
  },
  NotFound: {
    code: 2003,
    statusCode: 404,
    message: 'Item not found',
  },
  InvalidJSON: {
    code: 2003,
    statusCode: 400,
    message: 'Invalid JSON body',
    conversion: err =>
      err.name === 'SyntaxError' &&
      (err.message.indexOf('Unexpected token') === 0 ||
        err.message.indexOf('Unexpected string in JSON') === 0),
  },
  ValidationError: {
    code: 3000,
    statusCode: 400,
    message: 'Validation Error',
    conversion: {
      check: err => {
        return err.name === 'ValidationError' && err instanceof ValidationError
      },
      data: err => {
        return _.keys(err.errors).map(path => ({
          path,
          message: err.errors[path].message,
          // error:err.errors[path]
        }))
      },
    },
  },

  InvalidData: {
    code: 3001,
    statusCode: 400,
    message: 'Invalid Data',
  },
  TooSoon: {
    code: 3002,
    statusCode: 400,
    message: 'Same action repeated too soon',
  },
})
