<!-- https://github.com/joshfire/jsonform -->
<crud-jsonform>

    <div class="card">
        <div class="header">
            <h2>{opts.title}<small>{opts.description}</small></h2>
            <crud-header-dropdown if={opts.actionMenu !== false} service="{opts.service}" name="{opts.name}" views="{opts.views}" view="{opts.view}" query="{opts.query}" buttons="{opts.buttons}"></crud-header-dropdown>
        </div>
        <div class="body">
            <div id="jsonform-container"></div>
        </div>
    </div>

    <style type="text/css" src="/bower_components/jsonform/deps/opt/spectrum.css"></style>

    <script>
        var self = this;
        self.dependencies = [
                '/bower_components/jsonform/deps/opt/jsv.js',
                '/bower_components/jsonform/deps/underscore.js',
                '/bower_components/jsonform/deps/opt/spectrum.js',
                '/bower_components/jsonform/lib/jsonform.js'
        ];

        self.mixin('FeatherClientMixin');

        // this can move into serviceMixins
        self.refresh = (opts) => {
            // self.opts = opts;
            // self.update();
            // if(self.opts.query.id) {
            //     self.get(self.opts.query.id);
            // }
        },

        self.updateView = function(data) {
            self.initPlugins();
        },

        self.initPlugins = function(data) {
            console.log(self.schema, self.data);
            $('#jsonform-container').jsonForm({
                schema: self.opts.schema.properties,
                onSubmit: function (errors, values) {
                  if (errors) {
                    $('#res').html('<p>I beg your pardon?</p>');
                  }
                  else {
                    $('#res').html('<p>Hello ' + values.name + '.' +
                      (values.age ? '<br/>You are ' + values.age + '.' : '') +
                      '</p>');
                  }
                },
                values: self.data
              });

        }

        self.getData = () => {
            return {};
        }

    </script>

</crud-jsonform>

