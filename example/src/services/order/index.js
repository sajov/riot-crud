'use strict';

const path = require('path');
const NeDB = require('nedb');
const service = require('feathers-nedb');
// const service = require('feathers-memory');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const db = new NeDB({
    filename: path.join(app.get('nedb'), 'products.db'),
    autoload: true,
    inMemoryOnly: true
  });

  let options = {
    Model: db,
    paginate: {
      default: 5,
      max: 250
    }
  };

  // Initialize our service with any options it requires
  app.use('/orders', service(options));

  // Get our initialize service to that we can bind hooks
  const orderService = app.service('/orders');

  orderService.schema = require(process.cwd() + '/public/schema/order.json');
  // Set up our before hooks
  orderService.before(hooks.before);

  // Set up our after hooks
  orderService.after(hooks.after);
};
