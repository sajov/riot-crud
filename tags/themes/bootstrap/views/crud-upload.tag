<!-- feathers-example-upload https://github.com/CianCoders/feathers-example-fileupload -->
<crud-upload>

    <link rel="stylesheet" href="/bower_components/dropzone/dist/dropzone.css">
    <div>
        <div if={opts.type != 'inline'} class="page-title">
          <div class="title_left">
            <h3>
                <raw content="{opts.title}" /><small>{opts.description}</small></h3>
          </div>


        </div>
        </div>


        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                    <div class="x_title hidden-print">

                        <div class="nav navbar-right panel_toolbox">

                        </div>
                        <div class="pull-right"></div>
                        <div class="clearfix"></div>
                        <div class="x_content">
                            <br>
                            <h1>Let's upload some files!</h1>
                            <form action="http://localhost:3030/datauploads"
                              class="dropzone"
                              id="my-awesome-dropzone">
                                  <input type="text" name="user" value="sajo">
                              </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
    <script>
        var self = this;
        self.mixin(FeatherClientMixin);

        self.dependencies = [
                '//cdnjs.cloudflare.com/ajax/libs/core-js/2.1.4/core.min.js',
                '/bower_components/dropzone/dist/dropzone.js'
        ];

        this.on('mount', function() {
            RiotCrudController.loadDependencies(self.dependencies,'crud-upload', function (argument) {
                self.initPlugins();
            });
        });


        self.initPlugins = function() {

            // Now with Real-Time Support!
            self.client.service('datauploads').on('created', function(file){
                console.log('Received file created event!', file);
            });

            // Let's use DropZone!
            Dropzone.options.myAwesomeDropzone = {
                paramName: "uri",
                uploadMultiple: false,
                params: { foo: "bar" },
                init: function(){
                    this.on('uploadprogress', function(file, progress){
                        console.log('progresss', progress);
                    });
                    this.on('sending', function(file, xhr, formData) {
                        formData.append("dyndata", 'dude');
                    });
                }
            };
        }




    </script>

</crud-upload>

