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

exports.product = function(app, count) {

  console.log('run faker product');
  // console.log(faker);

  var helper = faker.helpers;


  for(var i = count; i >= 0; i--){

      var name = faker.commerce.productName();
      var price = parseFloat(faker.commerce.price());

      var prod = {
        id: i,
        active: faker.random.boolean(),
        sku: faker.finance.mask(),
        name: name,
        url: faker.internet.url() + '/' + faker.helpers.slugify(name),
        price_euro: price,
        price_dollar: price,
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
        attributes: {
          color: faker.commerce.color(),
          material: faker.commerce.productMaterial(),
          adjective: faker.commerce.productAdjective(),
        },
        base_color: '#ffa500',
        createdAt:'2016-12-18',
        updatedAt:'2016-12-18',
    };

    app.service('api/products').create(prod, {}).then(function(data) {
      console.log('Created product data', data);
    });
    console.log('FAKER product',prod);
    // post('http://localhost:3030/cms', prod);

  };
}



