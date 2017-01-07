'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('order service', function() {
  it('registered the orders service', () => {
    assert.ok(app.service('orders'));
  });
});
