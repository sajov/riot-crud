riot.tag2('crud-jsoneditor', '<div class="container"> <h3>JSON Editor</h3> <crud-top-bar></crud-top-bar> <div id="jsoneditor"></div> <a class="btn success" href="#" onclick="{store}">Speichern</a> </div> <link rel="stylesheet" href="http://cdn.jsdelivr.net/select2/3.4.8/select2.css">', '', '', function(opts) {
        var tag = this;

        tag.store = function(e) {
            e.preventDefault();

            var json = tag.editor.getValue();

            output = JSON.stringify(json,null,2);
            console.log('save',output);
            var validation_errors = tag.editor.validate();

            if(validation_errors.length) {
                alert(JSON.stringify(validation_errors,null,2));
            }
            else {
                 $.ajax({
                        type: "PATCH",
                        url: 'http://localhost:3030/api/products/1',
                        data: output,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){
                            console.info(data);
                        },
                        failure: function(errMsg) {
                            console.error(errMsg);
                        }
                  });
                console.log('valid');
            }

        }

        this.on('mount', function() {

            console.log('crud-jsoneditor update opts.query', this.opts.schema);

            $.ajax({
                type: 'get',
                url:'http://localhost:3030/api/products/1',

                success: function(data, textStatus, request){

                    console.info('success');
                    console.info(data);
                    console.info(request);
                    console.info(request.getResponseHeader('X-Total-Count'));
                    console.info('crud-jsoneditor update ajax callback',{
                        data: data
                    })

                    JSONEditor.defaults.options.theme = "bootstrap3";
                    JSONEditor.plugins.selectize.enable = true;
                    JSONEditor.defaults.iconlib = 'fontawesome4';
                    JSONEditor.plugins.selectize.enable = true;
                    JSONEditor.plugins.select2.width = "300px";

                    tag.editor = new JSONEditor(document.getElementById('jsoneditor'),{

                            schema: 'http://localhost:3030/schema/product_faker.json',
                            ajax:true,

                            schema: tag.opts.schema,
                            grid_columns: 2,
                            theme:'bootstrap3',

                            disable_edit_json: false

                          });
                    tag.editor.setValue(data);

                    console.log('schema',tag.opts.schema);

                },
                error: function (request, textStatus, errorThrown) {
                    alert('error');
                    alert(request.getResponseHeader('X-Total-Count'));
                }
            });

        })

});