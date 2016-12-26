'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const schema = require(process.cwd() + '/public/schema/product.json');

function test(hook, next) {

        // console.log('hook.test ????',hook.params);
        // console.log('hook.test ????',hook.query);
        next();

};


exports.before = {
  all: [],
  find: [test],
  get: [],
  create: [globalHooks.validateSchema(schema)],
  update: [globalHooks.validateSchema(schema)],
  patch: [globalHooks.validateSchema(schema)],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
