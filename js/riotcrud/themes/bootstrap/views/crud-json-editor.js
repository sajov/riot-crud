

riot.tag2('crud-json-editor', '<link rel="stylesheet" href="http://cdn.jsdelivr.net/select2/3.4.8/select2.css"> <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.2/summernote.css"> <div class="card"> <div class="header"> <h2>{opts.title}<small>{opts.description}???</small></h2> <crud-header-dropdown if="{opts.actionMenu !== false}" service="{opts.service}" name="{opts.name}" views="{opts.views}" view="{opts.view}" query="{opts.query}" buttons="{opts.buttons}"></crud-header-dropdown> </div> <div class="body"> <div id="jsoneditor"></div> </div> </div>', '', '', function(opts) {
        var self = this;
        self.debug = true;
        self.dependencies = [
                '/bower_components/json-editor/dist/jsoneditor.min.js',
                'http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.2/summernote.js'
        ];
        self.mixin('FeatherClientMixin');

        this.refresh = (opts) => {
            self.opts = opts;
            self.update();
            self.get(self.opts.query.id);
        },

        self.initView = () => {
            self.initJSONEditor();
            self.editor.setValue(self.data);

        }

        this.on('update', function() {
            self.initJSONEditor();
            self.editor.setValue(self.data);
        });
        this.on('mount', function() {
            console.warn('??? mount', Object.keys(self),self.getOpts())

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
                  console.error('Error crud-json-editor get', error);
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

                    schema: self.opts.schema,
                    theme:'bootstrap3',

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
                self.service.update(json.id,json).then(function(result){
                }).catch(function(error){
                  console.error('Error crud-json-editor savejsoneditor update', error);
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

