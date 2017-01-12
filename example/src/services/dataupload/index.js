'use strict';
const hooks = require('./hooks');

const multer = require('multer');
const multipartMiddleware = multer();
const dauria = require('dauria');
// feathers-blob service
const blobService = require('feathers-blob');
// Here we initialize a FileSystem storage,
// but you can use feathers-blob with any other
// storage service like AWS or Google Drive.
const fs = require('fs-blob-store');
const blobStorage = fs(__dirname + '/../../../uploads');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  create(data, params) {
    if(Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }
}

module.exports = function(){
  const app = this;

  // Initialize our service with any options it requires
  // app.use('/datauploads', new Service());
  app.use('/datauploads',

      // multer parses the file named 'uri'.
      // Without extra params the data is
      // temporarely kept in memory
      multipartMiddleware.single('uri'),

      // another middleware, this time to
      // transfer the received file to feathers
      function(req,res,next){
          console.log(req.body);
          req.feathers.file = req.file;
          next();
      },
      blobService({Model: blobStorage})
  );

  // Get our initialize service to that we can bind hooks
  const datauploadService = app.service('/datauploads');



  // Set up our before hooks
  // datauploadService.before(hooks.before);

  // Set up our after hooks
  // datauploadService.after(hooks.after);

  // before-create Hook to get the file (if there is any)
  // and turn it into a datauri,
  // transparently getting feathers-blob
  // to work with multipart file uploads
  datauploadService.before({
      create: [
          function(hook) {
              if (!hook.data.uri && hook.params.file){
                  const file = hook.params.file;
                  const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
                  hook.data = {uri: uri};
              }
          }
      ]
  });
};

module.exports.Service = Service;
