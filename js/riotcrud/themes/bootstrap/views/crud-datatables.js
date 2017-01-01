riot.tag2('crud-datatables', '<div class=""> <div class="page-title"> <div class="title_left"> <h3>{opts.title} <small>{opts.description}</small></h3> </div> <div class="title_right"> <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search"> <div class="input-group"> <input type="text" class="form-control" placeholder="Search for..."> <span class="input-group-btn"> <button class="btn btn-default" type="button">Go!</button> </span> </div> </div> </div> </div> <div class="clearfix"></div> <div class="row"> <div class="col-md-12 col-sm-12 col-xs-12"> <div class="x_panel"> <div class="x_content"> <table id="datatable" class="display table table-striped table-bordered datatable-buttons" cellspacing="0" width="100%"> <thead> <tr> <th if="{opts.selection}"><input onclick="{rowSelection}" type="checkbox"></th> <th each="{colkey, colval in opts.schema.required}" data-type="{colval.type}">{colkey}</th> <th></th> </tr> </thead> <tfoot> <tr id="filterrow" if="{opts.filterable}"> <th></th> <th each="{colkey, colval in opts.schema.required}" data-type="{colval.type}"> <small> <input type="text" name="filter_{colkey}" placeholder="filter {colkey}"></small> </th> <th>&nbsp;</th> </tr> </tfoot> </table> </div> </div> </div> </div> </div> <link href="https://cdn.datatables.net/v/bs/dt-1.10.13/b-1.2.4/b-colvis-1.2.4/b-flash-1.2.4/b-html5-1.2.4/b-print-1.2.4/cr-1.3.2/fc-3.2.2/fh-3.1.2/kt-2.2.0/r-2.1.0/rr-1.2.0/sc-1.4.2/se-1.2.0/datatables.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/datatables.net-bs/css/dataTables.bootstrap.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/datatables.net-buttons-bs/css/buttons.bootstrap.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/datatables.net-fixedheader-bs/css/fixedHeader.bootstrap.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/datatables.net-responsive-bs/css/responsive.bootstrap.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/datatables.net-scroller-bs/css/scroller.bootstrap.min.css" rel="stylesheet">', '.btn-group { display: flex; float: right; } table.dataTable th.focus, table.dataTable td.focus { outline: 2px solid silver!important; outline-offset: -1px; }', '', function(opts) {
        var self = this;
        self.mixin(serviceMixin);

        self.dependencies = [
            'https://cdn.datatables.net/v/bs/dt-1.10.13/b-1.2.4/b-colvis-1.2.4/b-flash-1.2.4/b-html5-1.2.4/b-print-1.2.4/cr-1.3.2/fc-3.2.2/fh-3.1.2/kt-2.2.0/r-2.1.0/rr-1.2.0/sc-1.4.2/se-1.2.0/datatables.min.js'

        ];

        self.refresh = function(query) {
            console.log('refresh',query.query);
            self.datatable.draw();
        }

        self.on('update', function(params, options) {
            console.info('CRUD-DATATABLES UPDATE',params, options);

        });

        self.on('updated', function(params, options) {
            console.info('CRUD-DATATABLES UPDATED',params, options);
        });

        self.on('updated', function(params, options) {
            console.info('CRUD-DATATABLES UPDATED',params, options);
        });

        self.on('mount', function(params, options) {
            console.log('CRUD-DATATABLES MOUNT',params, options);
            RiotCrudController.loadDependencies(self.dependencies,'crud-datatables', function (argument) {
                 self.initTable();
            });
            opts.tableHeader = opts.schema.defaultProperties || opts.schema.required;

            self.observable.on('delete', () => {
                alert('dude recieved event delete');
            })

        });

        self.on('mounted', function(params, options) {
            console.info('CRUD-DATATABLES UPDATED',params, options);
        });

        self.initTable = function() {

            self.datatable = $('#datatable').DataTable(self.getDatatableConfig());

            $('#datatable tfoot input').on('change keyup', function () {
                self.datatable
                    .column( $(this).parent().index()+':visible' )
                    .search( self.value )
                    .draw();
            } );

            $('.top_search input').on('change', function() {
                console.log($(this).val());
                self.datatable.search( self.value ).draw();
            });
        }

        self.getDatatableConfig = function() {
            var config = {
                order: [[0,'asc']],
                columns: [],
                "ajax": opts.baseUrl + '/' + opts.model,
                "processing": true,
                "serverSide": true,

                select:true,
                dom: "fBfrtip",

                "dom": '<"top"fi>rt<"bottom"Blp><"clear">',
                "dom": '<"top"li>rt<"bottom"ipB><"clear">',
                dom: "Blrtip",
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
                    }
                ],
                "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                "pageLength": 10,
                "search": false,
                "scrollX": true,

                responsive: true,
                fixedHeader: true,
                keys: true,
                "fnServerData": self.datatableSearch
            }

            if(opts.selection) {
                config.columns.push(
                    {
                        "data": null,
                        "targets": 0,
                        "order": false,
                        "orderable": false,

                        "render": function ( data, type, row ) {
                            return '<input type="checkbox" value="'+ row.id + '"/>';
                        }
                    }
                )
                config.order = [[1, 'asc']];
            }

            for (var i = 0;i < opts.tableHeader.length; i++) {
                var  col = opts.columns[opts.tableHeader[i]] || {data: opts.tableHeader[i]};
                config.columns.push(col);
            }

            if(opts.buttons) {
                config.columns.push(
                    {
                        "data": null,
                        "targets": -1,
                        "orderable": false,

                        "render": function ( data, type, row ) {

                            return '<div class="dt-buttons btn-group">' +
                                        '<a class="btn btn-info btn-xs" tabindex="0" aria-controls="ajaxdatatables" href="#' + opts.service + '/view/' + row.id + '"><i class="fa fa-edit"></i></a>' +
                                        '<a class="btn btn-danger btn-xs" onclick="riot.observable().trigger(\'delete\')"><i class="fa fa-trash-o"></i></a>' +
                                    '</div>';
                        }
                    }
                );
            }
            return config;
        }

        self.datatableSearch = function ( sSource, aoData, fnCallback ) {
            console.info('CRUD-DATATABLES self.DATATABLESEARCH ?=====????', sSource, aoData, fnCallback);

                var query = {};
                var queryObj = {};
                for (var i = aoData.length - 1; i >= 0; i--) {

                    queryObj[aoData[i].name] = aoData[i];
                }

                query.$limit = queryObj['length'].value;
                query.$skip = queryObj['start'].value;

                query = $.extend({}, query, opts.query.query);

                for (var i = queryObj.order.value.length - 1; i >= 0; i--) {

                    if(queryObj.columns.value[ queryObj.order.value[i].column ] != null) {
                        if(!query.$sort)
                            query.$sort = {};
                        query.$sort[queryObj.columns.value[ queryObj.order.value[i].column ].data] =  queryObj.order.value[i].dir == 'asc' ? 1 : -1;
                    }
                }

                if(queryObj.search.value.value !== "") {
                    query.name=queryObj.search.value.value;
                }

                self.service.find({query:query}).then(function(result){
                    console.info('CRUD-DATATABLES self.DATATABLESEARCH QUERY', query);
                    console.info('CRUD-DATATABLES self.DATATABLESEARCH RESULT', result);
                        fnCallback({
                            error: false,

                            recordsTotal: result.total,
                            recordsFiltered: result.total,
                            data: result.data
                        })
                }).catch(function(error){
                  console.error('Error CRUD-DATATABLES UPDATE FIND', error);
                });
        }

        self.rowSelection =  function(e) {

        }

});