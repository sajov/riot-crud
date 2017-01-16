
riot.tag2('crud-jsoneditor', '<link href="/bower_components/jsoneditor/dist/jsoneditor.min.css" rel="stylesheet"> <div> <div if="{opts.type != \'inline\'}" class="page-title"> <div class="title_left"> <h3>{opts.title} <small>{opts.description}</small></h3> </div> <div class="title_right"> <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search"> <div class="input-group"> <input type="text" class="form-control" placeholder="Search for..."> <span class="input-group-btn"> <button class="btn btn-default" type="button">Go!</button> </span> </div> </div> </div> </div> </div> <div class="row"> <div class="col-md-12 col-sm-12 col-xs-12"> <div class="x_panel"> <div class="x_title hidden-print"> <h2>{opts.title} <small>{opts.description}</small></h2> <div class="nav navbar-right panel_toolbox"> <crud-action-menu if="{opts.actionMenu !== false}" service="{opts.service}" name="{opts.name}" views="{opts.views}" view="{opts.view}" query="{opts.query}" buttons="{opts.buttons}"></crud-action-menu> </div> <div class="pull-right"></div> <div class="clearfix"></div> <div class="x_content"> <br> <div id="jsoneditor"></div> </div> </div> </div> </div> </div> <div class="clearfix"></div> </div>', 'div.jsoneditor-menu{ }', '', function(opts) {
        var self = this;
        self.mixin(FeatherClientMixin);

        self.dependencies = [
                '/bower_components/jsoneditor/dist/jsoneditor.min.js'
        ];

        this.refresh = (opts) => {
            self.opts = opts;
            self.update();
            if(self.opts.query.id) {
                self.get(self.opts.query.id);
            }
        },

        this.on('mount', function() {
            RiotCrudController.loadDependencies(self.dependencies,'crud-jsoneditor', function (argument) {
                self.initPlugins();
                if(self.opts.query && self.opts.query.id) {
                    self.get(self.opts.query.id)
                }
            });
        });

        self.get = function(id) {
            if(typeof id != 'undefined') {
                self.service.get(id).then(function(result){
                    if(typeof self.editor == 'undefined') {
                        self.initPlugins();
                    }
                    self.data = result;
                    self.editor.set(result);
                }).catch(function(error){
                  RiotControl.trigger(
                        'notification',
                        error.errorType + ' ' + self.eventKeyDeleteConfirmed,
                        'error',
                        error.message
                    );
                });
            } else {
                self.data = {};
            }
        }

        self.initPlugins = function(data) {

            self.opts.data = data;

            var container = document.getElementById("jsoneditor");
            var options = {};
            self.editor = new JSONEditor(container, options);

            var json = {
                "Array": [1, 2, 3],
                "Boolean": true,
                "Null": null,
                "Number": 123,
                "Object": {"a": "b", "c": "d"},
                "String": "Hello World"
            };
            self.editor.set(json);

            var json = self.editor.get();
        }

        self.getData = () => {
            return self.editor.get();
        }

});

