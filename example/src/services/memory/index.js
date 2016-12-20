'use strict';

const service = require('feathers-memory');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  let options = {
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/memories', service(options));

  // Get our initialize service to that we can bind hooks
  const memoryService = app.service('/memories');

  // Set up our before hooks
  memoryService.before(hooks.before);

  // Set up our after hooks
  memoryService.after(hooks.after);
};
