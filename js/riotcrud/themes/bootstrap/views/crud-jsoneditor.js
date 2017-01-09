
riot.tag2('crud-jsoneditor', '<link href="/bower_components/jsoneditor/dist/jsoneditor.min.css" rel="stylesheet"> <div> <div class="page-title"> <div class="title_left"> <h3>Product <small>Edit</small></h3> </div> <div class="title_right"> <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search"> <div class="input-group"> <input type="text" class="form-control" placeholder="Search for..."> <span class="input-group-btn"> <button class="btn btn-default" type="button">Go!</button> </span> </div> </div> </div> </div> </div> <div class="row"> <div class="col-md-12 col-sm-12 col-xs-12"> <div class="x_panel"> <div class="x_title hidden-print"> <h2>{opts.title} <small>{opts.service}</small></h2> <ul class="nav navbar-right panel_toolbox"> <li> <crud-action-menu name="{opts.name}" views="{opts.views}" view="{opts.view}" query="{opts.query}"></crud-action-menu> </li> <li> <a class="collapse-link"><i class="fa fa-chevron-up"></i></a> </li> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a> <ul class="dropdown-menu" role="menu"> <li> <a href="#">Settings 1</a> </li> <li> <a href="#">Settings 2</a> </li> </ul> </li> <li> <a class="close-link"><i class="fa fa-close"></i></a> </li> </ul> <div class="pull-right"></div> <div class="clearfix"></div> </div> <div class="x_content"> <div id="jsoneditor"></div> <a class="btn success" href="#" onclick="{saveJSONEditor}">Speichern</a> </div> </div> </div> </div> <div class="clearfix"></div> </div>', 'div.jsoneditor-menu{ }', '', function(opts) {
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
                if(self.opts.query.id) {
                    self.get(self.opts.query.id)
                }
            });
        });

        self.get = function(id) {

            if(typeof self.opts.query.id != 'undefined') {

                self.service.get(id).then(function(result){
                    if(typeof self.editor == 'undefined') {
                      self.initPlugins();
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

        self.initPlugins = function(data) {

            self.opts.data = data;

            var container = document.getElementById("jsoneditor");
            var options = {};
            var editor = new JSONEditor(container, options);

            var json = {
                "Array": [1, 2, 3],
                "Boolean": true,
                "Null": null,
                "Number": 123,
                "Object": {"a": "b", "c": "d"},
                "String": "Hello World"
            };
            editor.set(json);

            var json = editor.get();
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

