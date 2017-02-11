'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('download service', function() {
  it('registered the downloads service', () => {
    assert.ok(app.service('downloads'));
  });
});
