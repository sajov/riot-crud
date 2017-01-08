riot.tag2('crud-jsoneditor', '<div> <div class="page-title"> </div> <div class="row"> <div class="col-md-12 col-sm-12 col-xs-12"> <div class="x_panel"> <div class="x_title hidden-print"> <h2>{opts.title} <small>{opts.service}</small></h2> <ul class="nav navbar-right panel_toolbox"> <li> <crud-action-menu name="{opts.name}" views="{opts.views}" view="{opts.view}" query="{opts.query}"></crud-action-menu> </li> <li> <a class="collapse-link"><i class="fa fa-chevron-up"></i></a> </li> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a> <ul class="dropdown-menu" role="menu"> <li> <a href="#">Settings 1</a> </li> <li> <a href="#">Settings 2</a> </li> </ul> </li> <li> <a class="close-link"><i class="fa fa-close"></i></a> </li> </ul> <div class="pull-right"></div> <div class="clearfix"></div> </div> <div class="x_content"> <div id="jsoneditor"></div> <a class="btn success" href="#" onclick="{saveJSONEditor}">Speichern</a> </div> </div> </div> </div> <div class="clearfix"></div> </div> <link rel="stylesheet" href="http://cdn.jsdelivr.net/select2/3.4.8/select2.css"> <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.2/summernote.css">', '', '', function(opts) {
        var self = this;
        self.mixin(FeatherClientMixin);

        self.dependencies = [
                '/bower_components/json-editor/dist/jsoneditor.min.js',
                'http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.2/summernote.js'
        ];

        this.refresh = (opts) => {
            self.opts = opts;
            self.update();
            self.get(self.opts.query.id);
        },

        this.on('mount', function() {
            RiotCrudController.loadDependencies(self.dependencies,'crud-jsoneditor', function (argument) {
                self.initJSONEditor();
                self.get(self.opts.query.id)
            });
        });

        self.get = function(id) {

            if(typeof self.opts.query.id != 'undefined') {

                self.service.get(id).then(function(result){
                    if(typeof self.editor == 'undefined') {
                      self.initJSONEditor();
                    }
                    self.data = result;
                    self.editor.setValue(self.data);

                }).catch(function(error){
                  console.error('Error crud-jsoneditor get', error);
                });
            } else {
                self.data = {};
                self.editor.setValue(self.data);
            }
        }

        self.initJSONEditor = function(data) {

            self.opts.data = data;

            JSONEditor.defaults.options.theme = "bootstrap3";

            JSONEditor.plugins.selectize.enable = true;
            JSONEditor.defaults.iconlib = 'fontawesome4';
            JSONEditor.plugins.selectize.enable = true;
            JSONEditor.plugins.select2.width = "300px";

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
                self.service.update(json[opts.idField],json).then(function(result){
                }).catch(function(error){
                  console.error('Error crud-jsoneditor savejsoneditor update', error);
                });
            }
        }

        self.getData = () => {

            var json = self.editor.getValue();
            var validation_errors = self.editor.validate();

            if(validation_errors.length) {
                console.error(JSON.stringify(validation_errors,null,2));
                return false;
            } else {
                return json;
            }
        }

});

