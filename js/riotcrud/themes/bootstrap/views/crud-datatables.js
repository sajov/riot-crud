riot.tag2('crud-datatables', '<div class=""> <div class="page-title"> <div class="title_left"> <h3>{opts.title} <small>{opts.description}</small></h3> </div> <div class="title_right"> <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search"> <div class="input-group"> <input type="text" class="form-control" placeholder="Search for..."> <span class="input-group-btn"> <button class="btn btn-default" type="button">Go!</button> </span> </div> </div> </div> </div> <div class="clearfix"></div> <div class="row"> <div class="col-md-12 col-sm-12 col-xs-12"> <div class="x_panel"> <div class="x_content"> <table id="datatable" class="display table table-striped table-bordered datatable-buttons" cellspacing="0" width="100%"> <thead> <tr> <th if="{opts.selection}"><input onclick="{rowSelection}" type="checkbox"></th> <th each="{colkey, colval in opts.schema.required}" data-type="{colval.type}">{colkey}</th> <th></th> </tr> </thead> <tfoot> <tr id="filterrow" if="{opts.filterable}"> <th></th> <th each="{colkey, colval in opts.schema.required}" data-type="{colval.type}"> <small> <input type="text" name="filter_{colkey}" placeholder="filter {colkey}"></small> </th> <th></th> </tr> </tfoot> </table> </div> </div> </div> </div> </div> <link href="/bower_components/gentelella/vendors/datatables.net-bs/css/dataTables.bootstrap.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/datatables.net-buttons-bs/css/buttons.bootstrap.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/datatables.net-fixedheader-bs/css/fixedHeader.bootstrap.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/datatables.net-responsive-bs/css/responsive.bootstrap.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/datatables.net-scroller-bs/css/scroller.bootstrap.min.css" rel="stylesheet">', '', '', function(opts) {
        var tag = this;

        this.refresh = function(params, options) {

        }

        this.on('all', function(eventName) {
            console.info('ALL EVENTNAME',eventName)
        })

        this.on('update', function(params, options) {

        });

        this.on('updated', function(params, options) {

        });

        this.on('updated', function(params, options) {
            console.error('MOIUNGFT');
            console.info('DATATABLES UPDATED');

            tag.initTable();
        });

        this.on('mount', function() {
            console.log('DATATABLES MOUNT');
            opts.tableHeader = opts.schema.defaultProperties || opts.schema.required;
            console.error(opts.tableHeader);
        })

        this.initTable = function() {
            console.error('opts.tableData',opts.tableData);

            tag.datatable = $('#datatable').DataTable(tag.getDatatableConfig());

            $('#datatable tfoot input').on('change keyup', function () {
                tag.datatable
                    .column( $(this).parent().index()+':visible' )
                    .search( this.value )
                    .draw();
            } );

            $('.top_search input').on('change', function() {
                console.log($(this).val());
                tag.datatable.search( this.value ).draw();
            });
        }

        this.getDatatableConfig = function() {

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
                "fnServerData": tag.datatableSearch
            }

            if(opts.selection) {
                config.columns.push(
                    {
                        "data": null,
                        "targets": 0,
                        "order": false,

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
                console.info('add col',col);
            }

            if(opts.buttons) {
                config.columns.push(
                    {
                        "data": null,
                        "targets": -1,

                        "render": function ( data, type, row ) {

                            return '<a class="btn btn-default buttons-csv buttons-html5 btn-sm" tabindex="0" aria-controls="ajaxdatatables" href="#product/view/' + row.id + '"><span> Edit</span></a>';
                        }
                    }
                );
            }
            return config;
        }

        tag.datatableSearch = function ( sSource, aoData, fnCallback ) {

                var query = {};
                var queryObj = {};
                for (var i = aoData.length - 1; i >= 0; i--) {

                    queryObj[aoData[i].name] = aoData[i];
                }

                query.$limit = queryObj['length'].value;
                query.$skip = queryObj['start'].value;

                console.log('!!!!',queryObj.order);
                for (var i = queryObj.order.value.length - 1; i >= 0; i--) {

                    if(queryObj.columns.value[ queryObj.order.value[i].column ] != null) {
                        if(!query.$sort)
                            query.$sort = {};
                        query.$sort[queryObj.columns.value[ queryObj.order.value[i].column ].data] =  queryObj.order.value[i].dir == 'asc' ? 1 : -1;
                    }

                }

                if(queryObj.search.value.value !== "") {
                    console.log(queryObj.search.value.value);

                    query.name=queryObj.search.value.value;

                }

                $.ajax({
                   type: 'get',
                   url:'http://localhost:3030/products',

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