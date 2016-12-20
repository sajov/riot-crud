'use strict';

// Add any common hooks you want to share across services in here.
//
// Below is an example of how a hook is written and exported. Please
// see http://docs.feathersjs.com/hooks/readme.html for more details
// on hooks.

const Validator = require('jsonschema').Validator;
const v = new Validator();

exports.validateSchema = function(schema) {

    var s = schema;

    return function(hook, next) {

        console.log('hook.result',hook.result);

        v.addSchema(s, '/Schema');

        var validation = v.validate( hook.result, schema);

        if(validation.errors.length > 0) {
          hook.result = validation;
          console.log('validation ERROR',validation);
        }

        console.log('validation ERRORS 0');
        console.log('show in browser');

        next();

    };
};
