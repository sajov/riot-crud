<crud-jsoneditor>

    <div>
        <div class="page-title">
         <!--  <div class="title_left">
            <h3>Product <small>Edit</small></h3>
          </div>
 -->
          <!-- <div class="title_right">
            <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Search for...">
                <span class="input-group-btn">
                  <button class="btn btn-default" type="button">Go!</button>
                </span>
              </div>
            </div>
          </div> -->
        </div>


        <div class="row">
          <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
              <div class="x_title">
                <h2>{tag.opts.data.name}Default Example <small>Users</small></h2>
                <ul class="nav navbar-right panel_toolbox">
                  <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                  </li>
                  <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a>
                    <ul class="dropdown-menu" role="menu">
                      <li><a href="#">Settings 1</a>
                      </li>
                      <li><a href="#">Settings 2</a>
                      </li>
                    </ul>
                  </li>
                  <li><a class="close-link"><i class="fa fa-close"></i></a>
                  </li>
                </ul>
                <div class="clearfix"></div>
              </div>

              <div class="x_content">


                <div id="jsoneditor"></div>
                <a class="btn success" href="#" onclick={ store }>Speichern</a>

              </div>
            </div>
          </div>
        </div>

        <div class="clearfix"></div>


    </div>

    <link rel="stylesheet" href="http://cdn.jsdelivr.net/select2/3.4.8/select2.css">
    <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.2/summernote.css">


    <script>
        var tag = this;



        tag.store = function(e) {
            e.preventDefault();
            // console.log(e);
            // alert();
            var json = tag.editor.getValue();

            output = JSON.stringify(json,null,2);
            console.log('save',output);
            var validation_errors = tag.editor.validate();
            // // Show validation errors if there are any
            if(validation_errors.length) {
                alert(JSON.stringify(validation_errors,null,2));
            }
            else {
                 $.ajax({
                        type: "PATCH",
                        url: 'http://localhost:3030/api/products/' + tag.opts.query.id,
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

            // updateDirectLink();
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
                        // AJAX
            $.ajax({
                type: 'get',
                url:'http://localhost:3030/api/products/' + tag.opts.query.id || '',
                // url: tag.VM.config.baseUrl + '/' + tag.VM.model,
                success: function(data, textStatus, request){
                    tag.opts.data = data;
                    console.info('success');
                    console.info(data);
                    console.info(request);
                    console.info(request.getResponseHeader('X-Total-Count'));
                    console.info('crud-jsoneditor update ajax callback',{
                        data: data
                    })

                    // Set the global default
                    // JSONEditor.defaults.options.theme = "foundation6";
                    JSONEditor.defaults.options.theme = "bootstrap3";
                    JSONEditor.plugins.selectize.enable = true;
                    JSONEditor.defaults.iconlib = 'fontawesome4';
                    JSONEditor.plugins.selectize.enable = true;
                    JSONEditor.plugins.select2.width = "300px";
                    // JSONEditor.plugins.sceditor.emoticonsEnabled = true;
                    // JSONEditor.plugins.epiceditor.basePath = 'epiceditor';

                    tag.editor = new JSONEditor(document.getElementById('jsoneditor'),{

                            schema: 'http://localhost:3030/schema/product_faker.json',
                            ajax:true,
                            // schema: {
                            //   type: "object",
                            //   title: "Car",
                            //   properties: {
                            //     make: {
                            //       type: "string",
                            //       enum: [
                            //         "Toyota",
                            //         "BMW",
                            //         "Honda",
                            //         "Ford",
                            //         "Chevy",
                            //         "VW"
                            //       ]
                            //     },
                            //     model: {
                            //       type: "string"
                            //     },
                            //     year: {
                            //       type: "integer",
                            //       enum: [
                            //         1995,1996,1997,1998,1999,
                            //         2000,2001,2002,2003,2004,
                            //         2005,2006,2007,2008,2009,
                            //         2010,2011,2012,2013,2014
                            //       ],
                            //       default: 2008
                            //     }
                            //   }
                            // }
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



            // config = {

            //     // Seed the form with a starting value
            //     startval: this.VM.row,

            //     no_additional_properties: true,

            //     // Require all properties by default
            //     required_by_default: true,

            //     iconlib: "fontawesome4",
            //     // Disable additional properties
            //     no_additional_properties: false,
            //     disable_array_add: true,
            //     disable_array_delete_last_row: true,
            //     disable_array_delete_all_rows: true,
            //     disable_array_delete: true,
            //     disable_collapse: true,
            //     grid_columns: 2,
            //     // Require all properties by default
            //     required_by_default: false
            // };

            // if(this.VM.config.schema) {
            //     config.ajax = true;
            //     config.schema = this.VM.config.schema;
            // }

            // console.log('mount this.VM',this.VM);

            // tag.editor = new JSONEditor(this.jsoneditor, config);

            // // if(tag.VM.config.view === 'show') {
            // //     console.log('mount show');
            // //     tag.editor.disable();
            // // }

            // tag.editor.on('change',function() {
            //  if(tag.VM.config.view === 'show') {
            //     console.log('mount show');
            //     tag.editor.disable();

            // } else {
            //     tag.editor.getEditor('root.createdAt').disable();
            // }
            // });
        }


                // // Custom editor
        // JSONEditor.defaults.editors.dateTime = JSONEditor.defaults.editors.string.extend({
        //     getValue: function() {

        //         function getTimeZone() {
        //             var offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
        //             return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
        //         }

        //         return this.value+getTimeZone();
        //     },

        //     setValue: function(val) {

        //         // strip timeZone
        //         var stripedDateTime = val.substring(0, val.lastIndexOf("+"));


        //         if(this.value !== stripedDateTime) {
        //             this.value = stripedDateTime;
        //             this.input.value = this.value;
        //             this.refreshPreview();
        //             this.onChange();
        //         }
        //     },

        //     build: function() {
        //         this.schema.format = "datetime-local";
        //         this._super();

        //     }
        // });

        // // Instruct the json-editor to use the custom datetime-editor.
        // JSONEditor.defaults.resolvers.unshift(function(schema) {
        //     if(schema.type === "string" && schema.format === "datetime") {
        //         return "dateTime";
        //     }

        // });
    </script>

</crud-jsoneditor>