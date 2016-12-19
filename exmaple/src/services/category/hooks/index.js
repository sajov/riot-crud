'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const schema = require(process.cwd() + '/public/schema/category.json');

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [lobalHooks.validateSchema(schema)],
  update: [lobalHooks.validateSchema(schema)],
  patch: [lobalHooks.validateSchema(schema)],
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
