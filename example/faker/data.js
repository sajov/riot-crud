'use strict';

/**
 * [faker description]
 * http://jsonschema.net/#/
 * @type {[type]}
 */
var faker = require('faker');
var needle = require('needle');

const post = (url, data) => {
  console.log('POST!');

  var options = {
      headers: { 'X-Custom-Header': 'Bumblebee Tuna' }
  };
  console.log(url);

  needle.post(url, data, options, function(err, resp) {
    // console.log(resp.statusCode,resp.statusMessage);
    console.log('done')
  });
}

exports.cms = function(app, count) {
    console.log('run faker cms')
}

exports.category = function(app, count) {
  console.info('RUN FAKER CATEGORY');
  var helper = faker.helpers;

  for(var i = count; i >= 0; i--){

      var name = faker.commerce.productName();
      var description = faker.lorem.sentences();

      var prod = {
        _id: (i+1).toString(),
        active: faker.random.boolean(),
        name: name,
        description: description,
        url: faker.internet.url() + '/' + faker.helpers.slugify(name),
        image: faker.image.fashion(),
        locales: [
          {lang:'ES', title:name, description: faker.lorem.sentences()}
        ],
        images: [
          {
            href: 'https://www.medic-world.com/skin/frontend/ultimo/mw/images/flags/mwd.png',
            // href: faker.image.fashion(),
            title: faker.random.words(),
            description: faker.random.words(),
            mediaType: 'jpg',
          }
        ],
        createdAt:'2016-12-18',
        updatedAt:'2016-12-18',
    };

    app.service('categories').create(prod, {}).then(function(data) {
      // console.log('Created categories data', 'data');
    });
    if(i==1)
    console.log('FAKER categories',prod);
    // post('http://localhost:3030/cms', prod);

  };
}


exports.product = function(app, count, update) {
  if(update !== false)
  console.info('RUN FAKER PRODUCT');
  var helper = faker.helpers;
  var products = [];
  for(var i = count; i >= 0; i--){

      var name = faker.commerce.productName();
      var price = parseFloat(faker.commerce.price());
      var price_euro = faker.commerce.price(10.9, 17.9, 2, '') * 1;
      var price_dollar = faker.commerce.price(2.9, 7.9, 2, '') * 1;

      var prod = {
        _id: (i+1).toString(),
        active: faker.random.boolean(),
        sku: faker.finance.mask(),
        name: name,
        description: faker.lorem.sentences(),
        url: faker.internet.url() + '/' + faker.helpers.slugify(name),
        price_euro: price_euro,
        price_dollar: price_dollar,
        image: faker.image.fashion(),
        locales: [
          {lang:'EN', title:name, description: faker.lorem.sentences()},
          {lang:'ES', title:faker.commerce.productName(), description: faker.lorem.sentences()},
          {lang:'FR', title:faker.commerce.productName(), description: faker.lorem.sentences()},
          {lang:'IT', title:faker.commerce.productName(), description: faker.lorem.sentences()}
        ],
        images: [
          {
            href: 'https://www.medic-world.com/skin/frontend/ultimo/mw/images/flags/mwd.png',
            // href: faker.image.fashion(),
            title: faker.random.words(),
            description: faker.random.words(),
            mediaType: 'jpg',
          }
        ],
        attributes: {
          color: faker.commerce.color(),
          material: faker.commerce.productMaterial(),
          adjective: faker.commerce.productAdjective(),
        },
        base_color: '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] +
  (c && lol(m,s,c-1));})(Math,'0123456789ABCDEF',4),
        createdAt:'2016-12-18',
        updatedAt:'2016-12-18',
    };

    if(update !== false)
    app.service('products').create(prod, {}).then(function(data) {
      // console.log('Created product data', 'data');
    });

    products.push(prod);
    if(i==1 && update !== false)
    console.log('FAKER product',prod);
    // post('http://localhost:3030/cms', prod);

  };
  return products;
}


exports.order = function(app, count) {
  console.info('RUN FAKER ORDER');
  var helper = faker.helpers;

  for(var i = count; i >= 0; i--){

    var order = faker.helpers.contextualCard();
    var shippingAddress = faker.helpers.userCard();

    order._id = (i+1).toString();
    order.orderId = 100000 + i;
    order.account = '#'+faker.finance.account();
    order.name = shippingAddress.name;
    order.dob = dateFormat(order.dob);
    order.comment = faker.lorem.sentence();
    order.shippingAddress = shippingAddress.address;
    order.shippingAddress.name = shippingAddress.name;
    order.createdAt = dateFormat(faker.date.past());
    order.updatedAt = dateFormat(faker.date.past());

    order.items = this.product(app,faker.commerce.price(1, 6, 0, '') * 1, false);

    order.transaction = faker.helpers.createTransaction();
    order.transaction.date = dateFormat(order.transaction.date);

    // order.subtotal = faker.commerce.price(5.9, 7.9, 2, '') * 1;
    order.subtotal = 0;
    order.taxRate = 19.00;
    for (var item = 0; item < order.items.length; item++) {
      order.items[item].qty = faker.commerce.price(1, 3, 0, '') * 1;
      order.items[item].total = order.items[item].price_euro * order.items[item].qty;
      order.subtotal += order.items[item].total;
    }
    order.tax = faker.commerce.price(19, 19, 2, '') * 1;
    order.shipping = faker.commerce.price(5.9, 7.9, 2, '') * 1;
    order.discount = 0;
    order.total = parseFloat(((order.subtotal + order.shipping) * 1.19)).toFixed(2)*1;

    app.service('orders').create(order, {}).then(function(data) {
      // console.log('Created product data', 'data');
    });
    if(i==1)
    console.log('FAKER ORDER',order);
    // post('http://localhost:3030/cms', prod);

  };
// console.log('this.product',this.product);
}

function dateFormat(date) {
  return date.toISOString().
              replace(/T/, ' ').      // replace T with a space
              replace(/\..+/, '');
}