'use strict'

const exec = require('child_process').execSync
const wait = require('..')

function launchMysql () {
  let name = 'mocha-test-' + Date.now()
  let connectionDetails = {
    password: 'foobar'
  }

  exec(`docker run -d -P -e MYSQL_ROOT_PASSWORD=${connectionDetails.password} --name ${name} mysql`)
  connectionDetails.port = exec(
    `docker inspect -f '{{(index (index .NetworkSettings.Ports "3306/tcp") 0).HostPort}}' ${name}`
  ).toString().trim()


  return {
    connectionDetails,
    destroy: function () {
      exec('docker rm -f ' + name)
    }
  }
}

describe('mysql-wait', function () {
  let mysql
  before(() => {
    mysql = launchMysql()
  })

  it('should wait for mysql to come up', function () {
    this.timeout(60 * 1000)

    return wait(mysql.connectionDetails)
  })

  it('should connect immediately to an already available mysql server', () => {
    this.timeout(200)
    return wait(mysql.connectionDetails)
  })

  after(function () {
    this.timeout(20 * 1000)
    mysql.destroy()
  })
})
