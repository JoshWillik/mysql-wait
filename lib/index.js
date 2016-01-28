'use strict'

const mysql = require('mysql')
const merge = require('lodash.merge')

const DEFAULT_STEP_TIME = 1000
const DEFAULT_TIMEOUT = 60 * DEFAULT_STEP_TIME

const EXPECTED_ERRORS = ['ECONNREFUSED', 'PROTOCOL_CONNECTION_LOST']


function wait (timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

function connect (options) {
  var connection = mysql.createConnection(options)
  return new Promise((resolve, reject) => {
    connection.connect(err => {
      if (err) {
        reject(err)
      } else {
        connection.end()
        resolve()
      }
    })
  })
}

function tryConnect (options, step) {
  step = step || 0

  return connect(options).catch(err => {
    if (EXPECTED_ERRORS.indexOf(err.code) !== -1) {
      if (options.stepTime * step < options.timeout) {
        return wait(options.stepTime).then(() => tryConnect(options, step + 1))
      }
    }
    let error = new Error('MySQL not up: ' + err.code)
    error.code = err.code
    throw error
  })
}

function waitForDatabase (options) {
  options = merge({
    host: 'localhost',
    user: 'root',
    port: 3306,
    timeout: DEFAULT_TIMEOUT,
    stepTime: DEFAULT_STEP_TIME
  }, options)

  return tryConnect(options)
}

module.exports = waitForDatabase
