riot.tag2('crud-datatables', '<div class=""> <div class="page-title"> <div class="title_left"> <h3>Users <small>Some examples to get you started</small></h3> </div> <div class="title_right"> <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search"> <div class="input-group"> <input type="text" class="form-control" placeholder="Search for..."> <span class="input-group-btn"> <button class="btn btn-default" type="button">Go!</button> </span> </div> </div> </div> </div> <div class="clearfix"></div> <div class="row"> <div class="col-md-12 col-sm-12 col-xs-12"> <div class="x_panel"> <div class="x_title"> <h2>Default Example <small>Users</small></h2> <ul class="nav navbar-right panel_toolbox"> <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a> </li> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a> <ul class="dropdown-menu" role="menu"> <li><a href="#">Settings 1</a> </li> <li><a href="#">Settings 2</a> </li> </ul> </li> <li><a class="close-link"><i class="fa fa-close"></i></a> </li> </ul> <div class="clearfix"></div> </div> <div class="x_content"> <p class="text-muted font-13 m-b-30"> DataTables has most features enabled by default, so all you need to do to use it with your own tables is to call the construction function: <code>$().DataTable();</code> </p> <table id="ajaxdatatables" class="display table table-striped table-bordered datatable-buttons" cellspacing="0" width="100%"> <thead> <tr> <th each="{colkey, colval in opts.schema.required}" data-type="{colval.type}">{colkey}</th> </tr> </thead> <tfoot><tr></tr></tfoot> </table> <br> <br> <br> <br> <br> <div class="clearfix"></div> </div> </div> </div> </div> </div> <div class="container"> <h2>CRUD datatables</h2> {opts.title} <br> <br> <table id="ajaxdatatables" class="display" cellspacing="0" width="100%"> <thead> <tr> <th each="{colkey, colval in opts.schema.required}" data-type="{colval.type}">{colkey}</th> </tr> </thead> <tfoot><tr></tr></tfoot> </table> </div> <link href="/bower_components/gentelella/vendors/datatables.net-bs/css/dataTables.bootstrap.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/datatables.net-buttons-bs/css/buttons.bootstrap.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/datatables.net-fixedheader-bs/css/fixedHeader.bootstrap.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/datatables.net-responsive-bs/css/responsive.bootstrap.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/datatables.net-scroller-bs/css/scroller.bootstrap.min.css" rel="stylesheet">', '', '', function(opts) {
        var tag = this;

        tag.uppercase = function(str) {
            console.warn('update'+str.uppercase());
            return str.uppercase();
        }

        console.log(this);

        this.on('all', function(eventName) {
        console.info('ALL EVENTNAME',eventName)
        })

        this.refresh = function(params, options) {
            console.log('datatables refresh opts', opts.title);

        }

        this.on('update', function(params, options) {

            tag.opts.th = opts.schema.properties
            for (var i = opts.schema.properties.length - 1; i >= 0; i--) {
                console.warn('opts.schema.properties[i]',opts.schema.properties[i]);
            }
            console.log('datatables update opts', opts.title);
        });

        this.on('updated', function(params, options) {
            console.log('datatables updated opts', opts.schema.properties);
        });

        this.on('updated', function(params, options) {
            tag.initTable();
        });

        this.on('mount', function() {

            console.log('datatables mount opts', opts.title);

        })

        tag.initTable = function() {
            $('#ajaxdatatables').DataTable({
                    "ajax": opts.baseUrl + '/' + opts.model,
                    "processing": true,
                    "serverSide": true,
                    "columns": [
                        { "data": "id" },
                        { "data": "sku" },
                        { "data": "url" },
                        { "data": "product" },
                        { "data": "image" },
                        { "data": "active" },
                        { "data": "price_euro" },
                        { "data": "price_dollar" },
                        { "data": "attributes.color" },
                        { "data": "attributes.productMaterial" },

                    ],
                    dom: "Bfrtip",
                    buttons: [
                        {
                          extend: "copy",
                          className: "btn-sm"
                        },
                        {
                          extend: "csv",
                          className: "btn-sm"
                        },
                        {
                          extend: "excel",
                          className: "btn-sm"
                        },
                        {
                          extend: "pdfHtml5",
                          className: "btn-sm"
                        },
                        {
                          extend: "print",
                          className: "btn-sm"
                        },
                    ],
                    responsive: true,
                    fixedHeader: true,
                    keys: true,
                    "fnServerData": function ( sSource, aoData, fnCallback ) {

                        var query = {};
                        var queryObj = {};
                        for (var i = aoData.length - 1; i >= 0; i--) {
                            console.log('datatables aoData[i].name',aoData[i].name);
                            queryObj[aoData[i].name] = aoData[i];
                        }

                        query.$limit = queryObj['length'].value;
                        query.$skip = queryObj['start'].value;

                        query.$sort = {};

                        for (var i = queryObj.order.value.length - 1; i >= 0; i--) {
                            console.error(queryObj.order.value);
                            query.$sort[queryObj.columns.value[ queryObj.order.value[i].column ].data] =  queryObj.order.value[i].dir == 'asc' ? 1 : -1;

                        }

                        console.error(query.$sort)

                        if(queryObj.search.value.value !== "") {
                            var queryFields = [];
                            for (var i = queryObj.columns.value.length - 1; i >= 0; i--) {
                                if (queryObj.columns.value[i].searchable) {
                                    queryFields.push(queryObj.columns.value[i].data+'":"'+queryObj.search.value.value);
                                }
                            }
                            query.where = '{"or":["' + queryFields.join('","') + '""]}';
                        }

                        $.ajax({
                           type: 'get',
                           url:'http://localhost:3030/api/products',

                           data: query,
                           success: function(data, textStatus, request){

                            console.info('success');
                            console.info(data);
                            console.info(request);
                            console.info(request.getResponseHeader('X-Total-Count'));
                                fnCallback({
                                    error: false,

                                    recordsTotal: data.total,
                                    recordsFiltered: data.total,
                                    data: data.data
                                })
                           },
                           error: function (request, textStatus, errorThrown) {
                            alert('error');
                                alert(request.getResponseHeader('X-Total-Count'));
                           }
                        });

                    }
                });
        }

});