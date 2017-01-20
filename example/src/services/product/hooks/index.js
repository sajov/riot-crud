'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const schema = require(process.cwd() + '/public/schema/product.json');


exports.before = {
  all: [],
  find: [globalHooks.searchRegex()],
  get: [globalHooks.schema()],
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
