<!-- jsoneditor https://github.com/josdejong/jsoneditor/blob/master/bower.json -->
<crud-jsoneditor>


    <div class="card">
        <div class="header">
            <h2>{opts.title}<small>{opts.description}</small></h2>
            <crud-header-dropdown if={opts.actionMenu !== false} service="{opts.service}" name="{opts.name}" views="{opts.views}" view="{opts.view}" query="{opts.query}" buttons="{opts.buttons}"></crud-header-dropdown>
        </div>
        <div class="body">
            <div id="jsoneditor"></div>
        </div>
    </div>


    <link href="/bower_components/jsoneditor/dist/jsoneditor.min.css" rel="stylesheet">
    <style type="text/css">
        div.jsoneditor,
        div.jsoneditor-mode-tree{
            border:1px solid  #eee!important;
        }

        div.jsoneditor-menu {
            color: #fff;
            background-color: #eee!important;
            border-bottom: 1px solid #eee!important;
        }

        div.jsoneditor-menu{
            /*color: rgb(115,135,156);
            background: white!important;*/
        }
    </style>
    <script>
        var self = this;
        self.mixin('FeatherClientMixin');

        self.dependencies = [
                '/bower_components/jsoneditor/dist/jsoneditor.min.js'
        ];

        // this can move into serviceMixins
        self.refresh = (opts) => {
            self.opts = opts;
            self.update();
            alert(1)
            if(self.opts.query.id) {
                self.get(self.opts.query.id);
            }
        },


        self.on('before-mount', function(params, options) {
            RiotCrudController.loadDependencies(self.dependencies,'crud-jsoneditor', function (argument) {
                self.service.get('schema').then((result) => {
                    opts.schema = result;
                    self.initPlugins();
                    if(self.opts.query && self.opts.query.id) {
                        self.get(self.opts.query.id)
                    }
                }).catch((error) => {
                    console.error('console.errorconsole.errorconsole.errorconsole.error')
                });

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

        self.initView = function(data) {
            self.initPlugins();
        },

        self.initPlugins = function(data) {
            var container = document.getElementById("jsoneditor");
            var options = {
                modes: ['view', 'form', 'code', 'text']
            };
            self.editor = new JSONEditor(container, options);
            self.editor.set(self.data);
        }

        self.getData = () => {
            return self.editor.get();
        }


    </script>

</crud-jsoneditor>

