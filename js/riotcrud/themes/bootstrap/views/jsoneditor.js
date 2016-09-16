riot.tag2('crud-view-jsoneditor', '<div class="container"> <crud-top-bar></crud-top-bar> <div id="jsoneditor"></div> </div> <link rel="stylesheet" href="http://cdn.jsdelivr.net/select2/3.4.8/select2.css">', '', '', function(opts) {
    var tag = this;

        this.on('update', function() {

            if(typeof this.VM.row === 'undefined') {
                return true;
            }

            tag.VM.save = function() {
                var values = tag.editor.getValue();
                var fields = Object.keys(values);
                for (var i = fields.length - 1; i >= 0; i--) {
                    tag.VM.row[fields[i]] = values[fields[i]];
                }
                riotux.trigger(tag.VM.model+'Store','update',{id: tag.VM.row.id, data: tag.VM.row});
            };

            JSONEditor.defaults.options.theme = "foundation6";
            JSONEditor.plugins.selectize.enable = true;
            JSONEditor.defaults.iconlib = 'fontawesome4';
            JSONEditor.plugins.selectize.enable = true;
            JSONEditor.plugins.select2.width = "300px";

            config = {

                startval: this.VM.row,

                no_additional_properties: true,

                required_by_default: true,

                iconlib: "fontawesome4",

                no_additional_properties: false,
                disable_array_add: true,
                disable_array_delete_last_row: true,
                disable_array_delete_all_rows: true,
                disable_array_delete: true,
                disable_collapse: true,
                grid_columns: 2,

                required_by_default: false
            };

            if(this.VM.config.schema) {
                config.ajax = true;
                config.schema = this.VM.config.schema;
            }

            console.log('mount this.VM',this.VM);

            tag.editor = new JSONEditor(this.jsoneditor, config);

            tag.editor.on('change',function() {
             if(tag.VM.config.view === 'show') {
                console.log('mount show');
                tag.editor.disable();

            } else {
                tag.editor.getEditor('root.createdAt').disable();
            }
            });

        })

});