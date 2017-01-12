'use strict';
const dataupload = require('./dataupload');
const order = require('./order');
const memory = require('./memory');
const category = require('./category');
const product = require('./product');
const authentication = require('./authentication');
const user = require('./user');

module.exports = function() {
  const app = this;


  app.configure(authentication);
  app.configure(user);
  app.configure(product);
  app.configure(category);
  app.configure(memory);
  app.configure(order);
  app.configure(dataupload);
};
