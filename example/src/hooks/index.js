'use strict';

// Add any common hooks you want to share across services in here.
//
// Below is an example of how a hook is written and exported. Please
// see http://docs.feathersjs.com/hooks/readme.html for more details
// on hooks.

const Validator = require('jsonschema').Validator;
var fs = require('fs');
const v = new Validator();

exports.validateSchema = function(schema) {

    var s = schema;

    return function(hook, next) {

        // console.log('hook.result',hook.result);

        v.addSchema(s, '/Schema');

        var validation = v.validate( hook.result, schema);

        if(validation.errors.length > 0) {
          hook.result = validation;
          console.errors('validation ERROR',validation);
        }

        next();

    };
};

exports.searchRegex = function () {
  return function (hook) {
    const query = hook.params.query;
    for (let field in query) {
      if(query[field].$search && field.indexOf('$') == -1) {
        query[field] = { $regex: new RegExp(query[field].$search) }
      }
      if(field == '$or') {
        let plain = [];
        query[field].map((action, index) => {
            let f = Object.keys(action)[0];
            if(action[f].$search) {
                let q = {};
                let v = parseInt(action[f].$search) == action[f].$search ? parseInt(action[f].$search) : action[f].$search;
                q[f] = v;
                plain.push(q);
                action[f] = { $regex: new RegExp(action[f].$search, 'i') };
            }
            return action;
        });
        query[field] = query[field].concat(plain);
        console.log('$or', query[field]);
      }
    }
    hook.params.query = query
    return hook
  }
}


exports.schema = function () {
    return function (hook) {
        if (hook.id === 'schema' && hook.service.schema) {
                hook.result = hook.service.schema;
        }
        return hook;
    }
}

exports.csv = function () {
    return function (hook) {
        if (hook.id === 'csv' && hook.service.schema) {
                hook.result = hook.service.schema;
        }
        return hook;
    }
}