riot.tag2('crud-jsoneditor', '<div> <div class="page-title"> </div> <div class="row"> <div class="col-md-12 col-sm-12 col-xs-12"> <div class="x_panel"> <div class="x_title"> <h2>{tag.opts.data.name}Default Example <small>Users</small></h2> <ul class="nav navbar-right panel_toolbox"> <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a> </li> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a> <ul class="dropdown-menu" role="menu"> <li><a href="#">Settings 1</a> </li> <li><a href="#">Settings 2</a> </li> </ul> </li> <li><a class="close-link"><i class="fa fa-close"></i></a> </li> </ul> <div class="clearfix"></div> </div> <div class="x_content"> <div id="jsoneditor"></div> <a class="btn success" href="#" onclick="{store}">Speichern</a> </div> </div> </div> </div> <div class="clearfix"></div> </div> <link rel="stylesheet" href="http://cdn.jsdelivr.net/select2/3.4.8/select2.css"> <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.2/summernote.css">', '', '', function(opts) {
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
                        url: 'http://localhost:3030/products/' + tag.opts.query.id,
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
        });

        this.on('mounted', function() {

        });

        this.on('before-mount', () => {
            console.info('dashboard before-mount', tag);
            tag.initJSONEditor();
        });

        tag.initJSONEditor = function() {

            $.ajax({
                type: 'get',
                url:'http://localhost:3030/products/' + tag.opts.query.id || '',

                success: function(data, textStatus, request){
                    tag.opts.data = data;
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
                            object_layout: 'grid',
                            disable_edit_json: false,
                            form_name_root:'root[product][name]'

                          });
                    tag.opts.data = data;
                    tag.editor.setValue(data);
                    $('[data-schemaformat="html"]').summernote();

                    console.log('schema',tag.opts.schema);

                },
                error: function (request, textStatus, errorThrown) {
                    alert('error');
                    alert(request.getResponseHeader('X-Total-Count'));
                }
            });

        }

});