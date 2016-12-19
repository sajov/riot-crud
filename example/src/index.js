'use strict';

const app = require('./app');
const port = app.get('port');
const server = app.listen(port);
const faker = require('./../faker/product.js');
server.on('listening', function () {

  faker.product(app, 50);
  console.log(`Feathers application started on ${app.get('host')}:${port}`)
});