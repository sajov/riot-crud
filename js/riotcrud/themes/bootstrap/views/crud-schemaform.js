
riot.tag2('crud-jsoneditor', '<div class="card"> <div class="header"> <h2>{opts.title}<small>{opts.description}</small></h2> <crud-header-dropdown if="{opts.actionMenu !== false}" service="{opts.service}" name="{opts.name}" views="{opts.views}" view="{opts.view}" query="{opts.query}" buttons="{opts.buttons}"></crud-header-dropdown> </div> <div class="body"> <div id="jsoneditor"></div> </div> </div> <link href="/bower_components/jsoneditor/dist/jsoneditor.min.css" rel="stylesheet">', 'div.jsoneditor, div.jsoneditor-mode-tree{ border:1px solid #eee!important; } div.jsoneditor-menu { color: #fff; background-color: #eee!important; border-bottom: 1px solid #eee!important; } div.jsoneditor-menu{ }', '', function(opts) {
        var self = this;
        self.mixin('FeatherClientMixin');

        self.dependencies = [
                '/bower_components/jsoneditor/dist/jsoneditor.min.js'
        ];

        self.refresh = (opts) => {
            self.opts = opts;
            self.update();
            alert(1)
            if(self.opts.query.id) {
                self.get(self.opts.query.id);
            }
        },

        self.updateView = function(data) {

            self.initPlugins();
        },

        self.initPlugins = function(data) {

            var container = document.getElementById("jsoneditor");
            var options = {
                modes: ['view', 'form', 'code', 'text']
            };

            self.josdejongJsoneditor = new JSONEditor(container, options);
            self.josdejongJsoneditor.set(self.data);
        }

        self.getData = () => {
            return self.josdejongJsoneditor.get();
        }

});

