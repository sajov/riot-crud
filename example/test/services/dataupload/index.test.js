'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('dataupload service', function() {
  it('registered the datauploads service', () => {
    assert.ok(app.service('datauploads'));
  });
});
