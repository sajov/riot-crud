

riot.tag2('crud-json-editor', '<link rel="stylesheet" href="http://cdn.jsdelivr.net/select2/3.4.8/select2.css"> <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.2/summernote.css"> <div class="card"> <div class="header"> <h2>{opts.title}<small>{opts.description} ???</small></h2> <crud-header-dropdown if="{opts.actionMenu !== false}" service="{opts.service}" name="{opts.name}" views="{opts.views}" view="{opts.view}" query="{opts.query}" buttons="{opts.buttons}"></crud-header-dropdown> </div> <div class="body" onclick="{fake}"> <div id="jsoneditor-container"></div> </div> </div>', '', '', function(opts) {
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
        self.fake = () => {
            self.initJSONEditor();
        }
        self.updateView = () => {
            self.initJSONEditor();

        }

        self.initJSONEditor = function() {

            if(!self.JSONEditor)
            self.JSONEditor = new JSONEditor(document.getElementById('jsoneditor-container'),
                {

                    schema: self.opts.schema,
                    theme:'bootstrap3',

                }
            );
            console.error('self.JSONEditor',self.JSONEditor)
            self.JSONEditor.setValue(self.data);
            $('[data-schemaformat="html"]').summernote();
        }

        self.saveJSONEditor = function(e) {
            e.preventDefault();

            var json = self.JSONEditor.getValue();
            var validation_errors = self.JSONEditor.validate();
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

