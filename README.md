# MySQL Wait

A promise based API to wait for a MySQL database to become available.

## Install

```sh
$ npm install mysql-wait
```

## Usage

```js
var wait = require('mysql-wait')
wait({
  host: 'localhost',
  port: 3306,
  user: 'billy',
  password: 'bobjones'
}).then(function onSuccess () {
    console.log('database is up')
}, function onFail () {
    console.log('Database took too long, or credentials were bad')
})
```

## Options

### host

The host to connect to. Defaults to `localhost`.

### port

The port to connect with. Defaults to `3306`.

### user

The user to connect with. Defaults to `root`.

### password

The password to connect with. Has no default.

### timeout

How many milliseconds the waiter will wait until it fails. Defaults to `60 * 1000`
