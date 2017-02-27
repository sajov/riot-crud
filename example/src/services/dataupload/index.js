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
const uploadDir = __dirname + '/../../../uploads';
const blobStorage = fs(uploadDir);

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

class Upload {


    import(app, file, params) {

        console.log('Upload.import',file,params);
        this.importCsv(app, file, params)
        // service.create
    }

    importCsv(app, file, params ) {
        var csv=require('csvtojson')
        var uploadFile = uploadDir +'/' + file;

        csv({
            delimiter:";"
        })
        .fromFile(uploadFile)
        .on('json',(jsonObj)=>{
            // combine csv header row and csv line to a json object
            // jsonObj.a ==> 1 or 4
            console.log('jsonObj',jsonObj)
        })
        .on('end_parsed', (jsonArrObj)=>{
            app.service('categories').create(jsonArrObj, {}).then(function(data) {
                console.info('Upload.importCsv' , data);
            }).catch(function(error){
                console.error('Upload.importCsv' , error);
            });
        })
        .on('done',(error)=>{
            console.log('end',error)
        })



    }

    importCsvOLD(app, file, params ) {
        var fs = require('fs');
        var parse = require('csv-parse');

        var parser = parse({delimiter: ';',objectMode: true}, function(err, data){
          console.log('importCsv!!!', data);
            // app.service('categories').create(data, {}).then(function(data) {

            //     console.info('Upload.importCsv' , data);
            // }).catch(function(error){
            //     console.error('Upload.importCsv' , error);
            // });
        });

        fs.createReadStream(uploadDir+'/' + file).pipe(parser);

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
          // console.log('req.body',req);
          req.feathers.file = req.file;
          req.feathers.params = req.body;

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
                  // console.log('datauploadService.before',hook)
              }
          }
      ]
  });
  datauploadService.after({
      create: [
          function(hook) {
            let upload = new Upload();
            upload.import(app, hook.result.id, hook.params.params);
            console.log('datauploadService.after',hook.params.params,hook.result.id)
              // if (!hook.data.uri && hook.params.file){
              //     // console.log('hook','hook')
              // }
          }
      ]
  });
};

module.exports.Service = Service;
module.exports.Upload = Upload;
