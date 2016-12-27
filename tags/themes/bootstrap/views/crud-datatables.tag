<crud-datatables>

    <div class="">
            <div class="page-title">
              <div class="title_left">
                <h3>{ opts.title } <small>{ opts.description }</small></h3>
              </div>

              <div class="title_right">
                <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search for...">
                    <span class="input-group-btn">
                      <button class="btn btn-default" type="button">Go!</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="clearfix"></div>

            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">

                  <div class="x_content">

                    <table id="datatable" class="display table table-striped table-bordered datatable-buttons" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                <th if={opts.selection}><input onclick={rowSelection} type="checkbox" /></th>
                                <th each="{ colkey, colval in opts.schema.required }" data-type="{colval.type}">{ colkey }</th>
                                <th></th>
                            </tr>

                        </thead>
                        <tfoot>
                            <tr id="filterrow"  if={opts.filterable}>
                                <th></th>
                                <th each="{ colkey, colval in opts.schema.required }" data-type="{colval.type}">
                                   <small> <input type="text" name="filter_{ colkey }" placeholder="filter { colkey }"></small>
                                </th>
                                <th></th>
                            </tr>
                        </tfoot>
                    </table>

                  </div>
                </div>
              </div>
            </div>
    </div>

    <!-- <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/zf/dt-1.10.12/datatables.min.css"> -->
    <link href="/bower_components/gentelella/vendors/datatables.net-bs/css/dataTables.bootstrap.min.css" rel="stylesheet">
    <link href="/bower_components/gentelella/vendors/datatables.net-buttons-bs/css/buttons.bootstrap.min.css" rel="stylesheet">
    <link href="/bower_components/gentelella/vendors/datatables.net-fixedheader-bs/css/fixedHeader.bootstrap.min.css" rel="stylesheet">
    <link href="/bower_components/gentelella/vendors/datatables.net-responsive-bs/css/responsive.bootstrap.min.css" rel="stylesheet">
    <link href="/bower_components/gentelella/vendors/datatables.net-scroller-bs/css/scroller.bootstrap.min.css" rel="stylesheet">


    <script>
        var tag = this;
        var self = this;
        self.mixin(serviceMixin);

        self.refresh = function(query) {
            // console.log('datatables refresh opts', opts.title);
            console.log('refresh',query.query);
            // self.mergeParams(params);
            // riotux.trigger(self.VM.modelStore,'list',{tag:self.root.getAttribute('riot-tag'), params:params});
            self.update();
        }

        self.on('all', function(eventName) {
            console.info('ALL EVENTNAME',eventName)
        })

        self.on('update', function(params, options) {
            var dependencies = [
                '/bower_components/gentelella/vendors/datatables.net/js/jquery.dataTables.min.js',
                '/bower_components/gentelella/vendors/datatables.net-bs/js/dataTables.bootstrap.min.js',
                '/bower_components/gentelella/vendors/datatables.net-buttons/js/dataTables.buttons.min.js',
                '/bower_components/gentelella/vendors/datatables.net-buttons-bs/js/buttons.bootstrap.min.js',
                '/bower_components/gentelella/vendors/datatables.net-buttons/js/buttons.flash.min.js',
                '/bower_components/gentelella/vendors/datatables.net-buttons/js/buttons.html5.min.js',
                '/bower_components/gentelella/vendors/datatables.net-buttons/js/buttons.print.min.js',
                '/bower_components/gentelella/vendors/datatables.net-fixedheader/js/dataTables.fixedHeader.min.js',
                '/bower_components/gentelella/vendors/datatables.net-keytable/js/dataTables.keyTable.min.js',
                '/bower_components/gentelella/vendors/datatables.net-responsive/js/dataTables.responsive.min.js',
                '/bower_components/gentelella/vendors/datatables.net-responsive-bs/js/responsive.bootstrap.js',
                '/bower_components/gentelella/vendors/datatables.net-scroller/js/datatables.scroller.min.js',
                '/bower_components/gentelella/vendors/jszip/dist/jszip.min.js',
                '/bower_components/gentelella/vendors/pdfmake/build/pdfmake.min.js',
                '/bower_components/gentelella/vendors/pdfmake/build/vfs_fonts.js'
            ];
            // console.log('datatables update opts', opts.title);
        });

        self.on('updated', function(params, options) {
            // console.log('datatables updated opts', opts.schema.properties);
        });

        self.on('updated', function(params, options) {
            console.error('MOIUNGFT');
            console.info('DATATABLES UPDATED');
            tag.initTable();
        });

        self.on('mount', function() {
            console.log('DATATABLES MOUNT');
            opts.tableHeader = opts.schema.defaultProperties || opts.schema.required;
            console.error(opts.tableHeader);
        })

        /**
         * Init Datatable
         * @return {[type]} [description]
         */
        self.initTable = function() {
            console.error('opts.tableData',opts.tableData);

            tag.datatable = $('#datatable').DataTable(tag.getDatatableConfig());

            $('#datatable tfoot input').on('change keyup', function () {
                tag.datatable
                    .column( $(this).parent().index()+':visible' )
                    .search( self.value )
                    .draw();
            } );

            $('.top_search input').on('change', function() {
                console.log($(this).val());
                tag.datatable.search( self.value ).draw();
            });
        }

        /**
         * Get datatable configuration
         * @return object Datatable configurytion
         */
        self.getDatatableConfig = function() {
            var config = {
                order: [[0,'asc']],
                columns: [],
                "ajax": opts.baseUrl + '/' + opts.model,
                "processing": true,
                "serverSide": true,
                // dom: "Bfrtip",
                select:true,
                dom: "fBfrtip",
                // dom: "<Blf<t>ip>",
                // dom: "Bfrtip",
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
                // scrollY:        "300px",
                // scrollX:        true,
                // scrollCollapse: true,
                // fixedColumns:   {
                //     leftColumns: 1,
                //     rightColumns: 1
                // },
                // deferRender: true,
                // scrollY: 380,
                // scrollCollapse: true,
                // scroller: true,
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
                        "orderable": false,
                        // "defaultContent": "<button>Click!</button>",
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
                        "orderable": false,
                        // "defaultContent": "<button>Click!</button>",
                        "render": function ( data, type, row ) {
                            // return data +' ('+ row.sku+')';
                            return '<div class="dt-buttons btn-group">' +
                                        '<a class="btn btn-info btn-xs btn-blockNo" tabindex="0" aria-controls="ajaxdatatables" href="#' + opts.service + '/view/' + row.id + '"><span> Edit</span></a>' +
                                        '<a class="btn btn-danger btn-xs btn-blockNo" href="#"><span> Delete</span></a>' +
                                    '</div>';
                        }
                    }
                );
            }
            return config;
        }

        /**
         * Data Table Search Function
         * @param  {[type]} sSource    [description]
         * @param  {[type]} aoData     [description]
         * @param  {[type]} fnCallback [description]
         * @return {[type]}            [description]
         */
        tag.datatableSearch = function ( sSource, aoData, fnCallback ) {
            console.info('CRUD-JSONEDITOR TAG.DATATABLESEARCH ?=====????', sSource, aoData, fnCallback);
                /* reorganize query */
                var query = {};
                var queryObj = {};
                for (var i = aoData.length - 1; i >= 0; i--) {
                    // console.log('datatables aoData[i].name',aoData[i].name);
                    queryObj[aoData[i].name] = aoData[i];
                }

                /* limit / offset */
                query.$limit = queryObj['length'].value;
                query.$skip = queryObj['start'].value;

                query = $.extend({}, query, opts.query.query);
                /* sort */
                for (var i = queryObj.order.value.length - 1; i >= 0; i--) {
                    // console.error(queryObj.order.value);
                    if(queryObj.columns.value[ queryObj.order.value[i].column ] != null) {
                        if(!query.$sort)
                            query.$sort = {};
                        query.$sort[queryObj.columns.value[ queryObj.order.value[i].column ].data] =  queryObj.order.value[i].dir == 'asc' ? 1 : -1;
                    }
                }


                /* search */
                if(queryObj.search.value.value !== "") {
                    query.name=queryObj.search.value.value;
                }

                tag.service.find({query:query}).then(function(result){
                    console.info('CRUD-JSONEDITOR TAG.DATATABLESEARCH QUERY', query);
                    console.info('CRUD-JSONEDITOR TAG.DATATABLESEARCH RESULT', result);
                        fnCallback({
                            error: false,
                            // recordsTotal: request.getResponseHeader('X-Total-Count'),
                            // recordsFiltered: request.getResponseHeader('X-Total-Count'),
                            // data: data
                            recordsTotal: result.total,
                            recordsFiltered: result.total,
                            data: result.data
                        })
                }).catch(function(error){
                  console.error('Error CRUD-JSONEDITOR UPDATE FIND', error);
                });
        }

        tag.rowSelection =  function(e) {
            // console.log(e);
            // alert($(e.target).attr('selected'))
        }

    </script>

</crud-datatables>