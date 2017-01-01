<crud-jsoneditor>

    <div>
        <div class="page-title">
         <!--  <div class="title_left">
            <h3>Product <small>Edit</small></h3>
          </div>
 -->
          <!-- <div class="title_right">
            <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Search for...">
                <span class="input-group-btn">
                  <button class="btn btn-default" type="button">Go!</button>
                </span>
              </div>
            </div>
          </div> -->
        </div>


        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                    <div class="x_title hidden-print">
                        <h2>{opts.title} <small>{opts.service}</small></h2>

                        <ul class="nav navbar-right panel_toolbox">
                            <li>
                               <crud-action-menu name="{opts.name}" views="{opts.views}" view="{opts.view}" data="{opts.query}"></crud-action-menu>
                            </li>
                            <li>
                                <a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                            </li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a>
                                <ul class="dropdown-menu" role="menu">
                                    <li>
                                        <a href="#">Settings 1</a>
                                    </li>
                                    <li>
                                        <a href="#">Settings 2</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a class="close-link"><i class="fa fa-close"></i></a>
                            </li>
                        </ul>

                        <div class="pull-right"></div>
                        <div class="clearfix"></div>
                    </div>

                    <div class="x_content">

                        <div id="jsoneditor"></div>
                        <a class="btn success" href="#" onclick={ saveJSONEditor }>Speichern</a>

                    </div>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>

    <link rel="stylesheet" href="http://cdn.jsdelivr.net/select2/3.4.8/select2.css">
    <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.2/summernote.css">


    <script>
        var self = this;
        self.mixin(serviceMixin);


        self.dependencies = [
                '/bower_components/json-editor/dist/jsoneditor.min.js',
                'http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.2/summernote.js'
        ];

        this.on('update', function() {
            console.info('CRUD-JSONEDITOR UPDATE',self.opts.query);
            if(typeof self.editor == 'undefined') {
                // self.initJSONEditor({})
                // alert(document.getElementById('jsoneditor'));
            }

            if(typeof self.opts.query.id != 'undefined') {
                RiotCrudController.loadDependencies(self.dependencies,'crud-jsoneditor', function (argument) {
                    self.get(self.opts.query.id)
                });
            }

        });

        // this can move into serviceMixins
        this.refresh = (opts) => {
            self.opts = opts;
            self.update();
        },


        this.on('before-mount', () => {console.info('CRUD-JSONEDITOR BEFORE-MOUNT',self.opts.query);});

        this.on('mount', function() {
            console.info('CRUD-JSONEDITOR MOUNT',self.opts.query, self.opts.view, self.opts.views);
            RiotCrudController.loadDependencies(self.dependencies,'crud-jsoneditor', function (argument) {
                self.initJSONEditor();
            });
        });

        this.on('mounted', function() {console.info('CRUD-JSONEDITOR MOUNTED',self.opts.query);});

        self.get = function(id) {

            self.service.get(id).then(function(result){
                console.info('CRUD-JSONEDITOR UPDATE FIND', result);
                if(typeof self.editor == 'undefined') {
                  self.initJSONEditor();
                }
                self.data = result;
                self.editor.setValue(result);

            }).catch(function(error){
              console.error('Error CRUD-JSONEDITOR UPDATE FIND', error);
            });
        }

        self.initJSONEditor = function(data) {

            self.opts.data = data;

            JSONEditor.defaults.options.theme = "bootstrap3";
            // JSONEditor.defaults.options.theme = "foundation6";
            JSONEditor.plugins.selectize.enable = true;
            JSONEditor.defaults.iconlib = 'fontawesome4';
            JSONEditor.plugins.selectize.enable = true;
            JSONEditor.plugins.select2.width = "300px";
            // JSONEditor.plugins.sceditor.emoticonsEnabled = true;
            // JSONEditor.plugins.epiceditor.basePath = 'epiceditor';

            JSONEditor.defaults.disable_collapse = true;
            JSONEditor.defaults.disable_edit_json = true;
            JSONEditor.defaults.disable_properties = true;
            JSONEditor.defaults.no_additional_properties = true;

            self.editor = new JSONEditor(document.getElementById('jsoneditor'),
                {
                    schema: 'http://localhost:3030/schema/product_faker.json',
                    ajax:true,
                    schema: self.opts.schema,
                    theme:'bootstrap3',
                    object_layout: 'grid',
                    grid_columns: 10,
                    expand_height: true,
                    disable_edit_json: true,
                    disable_collapse: true,
                    disable_edit_json: true,
                    disable_properties: true,
                    // no_additional_properties: true,
                    form_name_root:'root[product][name]'

                }
            );

            $('[data-schemaformat="html"]').summernote();
        }

        self.saveJSONEditor = function(e) {
            e.preventDefault();

            var json = self.editor.getValue();
            var validation_errors = self.editor.validate();
            if(validation_errors.length) {
                console.error(JSON.stringify(validation_errors,null,2));
            } else {
                self.service.update(json.id,json).then(function(result){
                  console.info('CRUD-JSONEDITOR saveJSONEditor update', result);
                }).catch(function(error){
                  console.error('Error CRUD-JSONEDITOR saveJSONEditor update', error);
                });
            }
        }

        this.create = (e) => {

            e.preventDefault();

            console.clear();

            var json = self.editor.getValue();
            var validation_errors = self.editor.validate();

            if(validation_errors.length) {
                console.error(JSON.stringify(validation_errors,null,2));
            } else {

                // delete json.id;
                json.id = 9879;

                self.service.create(json).then(function(result){
                  console.info('CRUD-JSONEDITOR result', result);
                }).catch(function(error){
                  console.error('CRUD-JSONEDITOR error', json, error);
                });
            }

            console.info(opts.data,json,validation_errors)
        }

        // self.create = function(e) {
        //     e.preventDefault();

        //     var json = self.editor.getValue();
        //     var validation_errors = self.editor.validate();
        //     alert('create');
        //     // if(validation_errors.length) {
        //     //     console.error(JSON.stringify(validation_errors,null,2));
        //     // } else {
        //     //     self.service.update(json.id,json).then(function(result){
        //     //       console.info('CRUD-JSONEDITOR saveJSONEditor update', result);
        //     //     }).catch(function(error){
        //     //       console.error('Error CRUD-JSONEDITOR saveJSONEditor update', error);
        //     //     });
        //     // }
        // }

    </script>

</crud-jsoneditor>

