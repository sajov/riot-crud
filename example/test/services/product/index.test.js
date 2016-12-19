'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('product service', function() {
  it('registered the products service', () => {
    assert.ok(app.service('products'));
  });
});
