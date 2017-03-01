<!-- feathers-example-upload https://github.com/CianCoders/feathers-example-fileupload -->
<crud-upload>

    <link rel="stylesheet" href="/bower_components/dropzone/dist/dropzone.css">
    <style type="text/css">
        .dropzone {
            padding: 0!important;
        }
    </style>
    <div>
        <small>{opts.description || opts.service + "uploads data in CSV or JSON"}</small>
        <form action="http://{opts.hostname}:3030/datauploads" class="dropzone" id="my-awesome-dropzone"></form>
        <div class="progress">
            <div class="progress-bar bg-cyan progress-bar-striped active" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: {progress}%">
                CYAN PROGRESS BAR
            </div>
        </div>
    </div>

    <script>
        var self = this;
        self.progress = 0;
        self.mixin('FeatherClientMixin');
        self.opts.hostname = window.location.hostname;
        self.dependencies = [
                'http://cdnjs.cloudflare.com/ajax/libs/core-js/2.1.4/core.min.js',
                '/bower_components/dropzone/dist/dropzone.js'
        ];

        self.on('mount', function() {
            RiotCrudController.loadDependencies(self.dependencies,'crud-upload', function (argument) {
                self.update();
                self.initPlugins();
            });
        });

        self.initPlugins = function() {
            // Now with Real-Time Support!
            // TODO:  ADD this to service event listener
            self.client.service('datauploads').on('created', function(file){
                console.log('Received file created event!', file);
                RiotControl.trigger(opts.service + '_list_update');
            });

            self.client.service('datauploads').on('error', function(file){
                console.log('Received file created event!', file);

                // self.refs.ordertable.reInit();
            });

            // Let's use DropZone!
            DropzoneOPTS = {
                paramName: "uri",
                uploadMultiple: false,
                maxFilesize: 2000,
                params: { foo: "bar" },
                accept: function(file, done) {
                    // console.log('accept', file)
                    if(file.type == 'application/json' || file.type == 'text/csv') {
                        done();
                    } else {
                        done("Only accept CSV and JSON file types.");
                    }
                },
                init: function(){
                    this.on('uploadprogress', function(file, progress){
                        console.log('progresss', progress);
                        self.progress = progress;
                        self.update();
                    });
                    this.on('sending', function(file, xhr, formData) {
                        formData.append("service", opts.service);
                    });
                    this.on('complete', function(file) {
                        console.log('complete', file);
                        // TODO:  ADD this to service event listener
                        RiotControl.trigger(
                            'notification',
                            'File Upload Success',
                            'success',
                            'File ' + file.name + ' cerated'
                        );
                        self.progress = 0;
                        self.update();
                    });
                }
            };

            self.dropzone = new Dropzone(document.querySelector("#my-awesome-dropzone"),DropzoneOPTS);
            self.dropzone.on("complete", function(file) {
              setTimeout(function(){
                self.dropzone.removeFile(file)
            },3000)
            });
        }

    </script>

</crud-upload>

