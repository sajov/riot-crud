'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('memory service', function() {
  it('registered the memories service', () => {
    assert.ok(app.service('memories'));
  });
});
