'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('category service', function() {
  it('registered the categories service', () => {
    assert.ok(app.service('categories'));
  });
});
