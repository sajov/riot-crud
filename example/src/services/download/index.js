'use strict';

/**
 * http://www.techumber.com/html-to-pdf-conversion-using-javascript/
 *
 */

const hooks = require('./hooks');
const fs = require('fs');
const stringify = require('csv-stringify');
const json2csv = require('json2csv');
const parse = require('csv-parse');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {

    return Promise.resolve([]);
  }


}

module.exports = function(){
  const app = this;

  // Initialize our service with any options it requires
  app.use('/downloads', new Service());

  app.get('/download/pdf', function(req, res){

    var file = fs.readFileSync(__dirname + '/../../../uploads/11e6fbabf7f73827200b4f587c85e8e55b75e477c357531fd67aa330573d438b.pdf', 'binary');
        console.log('stringify',{name:"sajo",age:45});
    stringify([['name','age'],['sajov',45]], function(err, csv) {
        console.log(err, csv);
    });
    res.setHeader('Content-Length', file.length);
    res.write(file, 'binary');
    res.end();
  });


  app.get('/download/csv', function(req, res){
      // res.format({
      //   "text/plain": function() {
      //         stringify([['name','age'],['sajov',45]], function(err, csv) {
      //             if (err) {
      //                 res.send('error');
      //             } else {
      //                 res.send(csv);
      //             }
      //         });
      //     // res.end(`The Message is: "${res.data.text}"`);
      //     // res.end(`The Message is: "${res.data.text}"`);
      //   }
      // });

      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'filename="keywords.csv"'
      });
      console.log(req);
      // stringify([['name','age'],['sajov',45]], function(err, csv) {
      //     if (err) {
      //         res.send('error');
      //     } else {
      //         res.send(csv);
      //     }
      // });


       var config = {
          // fields : ['TITEL','TEXT1','TEXT2','Display-URL','Anlässe','Sortiment','Prio'],
          fields : ['name','age'],
          data: [{name:'sajov', age:44}],
          del: ';'
        };

        json2csv(config, function(err, csv) {
            if (err) {
                res.send('error');
            } else {
                res.send(csv);
            }
        });
  });




  // Get our initialize service to that we can bind hooks
  const downloadService = app.service('/downloads');

  // Set up our before hooks
  downloadService.before(hooks.before);

  // Set up our after hooks
  downloadService.after(hooks.after);
};

module.exports.Service = Service;
