'use strict';

const app = require('./app');
const port = app.get('port');
const server = app.listen(port);
const faker = require('./../faker/data.js');
server.on('listening', function () {

  faker.product(app, 150);
  faker.category(app, 50);
  faker.order(app, 24);
  console.log(`Feathers application started on ${app.get('host')}:${port}`)
});