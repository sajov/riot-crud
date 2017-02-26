
riot.tag2('crud-json-forms', '<link href="/bower_components/json-forms/dist/css/brutusin-json-forms.min.css" rel="stylesheet"> <div class="card"> <div class="header"> <h2>{opts.title} <span if="{data}">{data._id}</span><small>{opts.description}</small></h2> <crud-header-dropdown if="{opts.actionMenu !== false}" service="{opts.service}" name="{opts.name}" views="{opts.views}" view="{opts.view}" query="{opts.query}" buttons="{opts.buttons}"></crud-header-dropdown> </div> <div class="body"> <div id="json-forms{opts.service}"></div> </div> </div>', '', '', function(opts) {
        var self = this;

        self.mixin('FeatherClientMixin');

        self.dependencies = [
                '/bower_components/json-forms/dist/js/brutusin-json-forms.min.js',
                '/bower_components/json-forms/dist/js/brutusin-json-forms-bootstrap.min.js'
        ];

        this.refresh = (opts) => {
            self.opts = opts;
            self.update();
            if(self.opts.query.id) {
                self.get(self.opts.query.id);
            }
        },

        self.on('update', function (){

            $('#json-forms'+self.opts.service).html('');
            self.initPlugins();
        })

        self.updateView = () => {

            if(self.editor) {
                self.update();
            } else {
                self.initPlugins();
            }
        }

        self.initPlugins = function() {

            var schema = self.opts.schema;
            Object.keys(schema.properties).map(function(objectKey, index) {
                if(schema.required && schema.required.indexOf(objectKey) !== -1) {
                    if(schema.properties[objectKey].type != 'boolean')
                        schema.properties[objectKey].required = true;
                }
            });

            var BrutusinForms = brutusin["json-forms"];
            self.editor = BrutusinForms.create(schema);

            var container = document.getElementById('json-forms'+self.opts.service);
            self.editor.render(container, self.data);
        }

        self.getData = () => {
            var validation = self.editor.validate();
            if(validation) {
                self.data = self.editor.getData();
                return self.editor.getData();
            } else {
                console.log(self.editor.getData(),validation);
                return false;
            }

        }

});

