/**
 * @module logger
 */
'use strict'
var winston = require('winston')

winston.addColors({
  error: 'red',
  warn: 'yellow',
  audit: 'green',
  info: 'white'
})

var logger

if (process.env.NODE_ENV !== 'test') {
  logger = new (winston.Logger)({
    levels: {
      error: 0,
      warn: 1,
      audit: 2,
      info: 3
    },
    transports: [
      new (winston.transports.Console)({
        'timestamp': true,
        formatter: function (options) {
          return JSON.stringify(Object.assign({
            'level': options.level
          }, options.meta))
        }
      })
    ]
  })
} else {
  logger = new (winston.Logger)({
    levels: {
      error: 0,
      warn: 1,
      audit: 2,
      info: 3
    }
  })
}

module.exports = {
  auditLog: auditLog,
  log: log
}

/**
 * @desc logs retrieval and submission events for auditing in the format:
 * date - type: interactionType=interactionTypeValue, phu=phuValue, submissionId=submissionIdValue, [sessionId] responseStatusCode=responseStatusCodeValue
 * @param {string} type - types of logs, they are: error, warn, public, verbose, debug
 * @param {object} options
 */
function auditLog (type, options) {
  options = options || {}

  var metaObject = {
    timeStamp: new Date()
  }
  var message = '[AUDIT] [' + metaObject.timeStamp + ']'

  if (typeof options.clientip !== 'undefined') {
    message += ' [' + options.clientip + ']'
  }
  if (typeof options.interactionType !== 'undefined') {
    message += ' [' + options.interactionType + ']'
  }
  if (typeof options.phuName !== 'undefined') {
    message += ' [' + options.phuName + ']'
  }
  if (typeof options.phuAcronym !== 'undefined') {
    message += ' [' + options.phuAcronym + ']'
  }
  if (typeof options.sessionId !== 'undefined') {
    message += ' [' + options.sessionId + ']'
  }
  if (typeof options.submissionId !== 'undefined') {
    message += ' [' + options.submissionId + ']'
  }
  if (typeof options.responseStatusCode !== 'undefined') {
    message += ' [' + options.responseStatusCode + ']'
  }

  var auditMessage = {
    message: message
  }
  options = Object.assign(auditMessage, options)

  logger.log('audit', options)
}

/**
 * @desc basic logging for general use the log in the format:
 * date - type: optionName=optionValue,...
 * @param {string} type - types of logs, they are: error, warn, public, verbose, debug
 * @param {object} options - options will log optionName=optionValue
 */
function log (type, options) {
  options = options || {}

  logger.log(type, options)
}
