<crud-datatables>

    <div class="card">
        <div class="header">
            <h2>{opts.title}<small>{opts.subtitle}</small></h2>

            <crud-header-dropdown if={opts.actionMenu !== false} service="{opts.service}" name="{opts.name}" views="{opts.views}" view="{opts.view}" query="{opts.query}" buttons="{opts.buttons}"></crud-header-dropdown>

            <div class="input-group" style="margin-bottom:0px">
                <span onclick={ search }  class="input-group-addon">
                    <i class="material-icons">search</i>
                </span>
                <div class="form-line">
                    <input type="text" onkeyup={ datatableSearch } class="form-control date" placeholder="search for ...">
                </div>
            </div>
        </div>


        <div class="body">
           <table id="datatable" class="display table table-striped table-bordered datatable-buttons" cellspacing="0" width="100%">
                <thead>
                    <tr>
                        <th if={opts.selection}>
                            <input type="checkbox" id="basic_checkbox_all" checked="{ 'checked': selection.length ==  data.data.length }">
                            <label onclick={ selectall }  data-value="{ selection.length ==  data.data.length ? 1 : 0 }" for="basic_checkbox_all"></label>
                        </th>
                        <th each="{ colkey, colval in opts.tableHeader }" data-type="{colval.type}">{ colkey }</th>
                        <th></th>
                    </tr>

                </thead>
                <tfoot>
                    <tr id="filterrow"  if={opts.filterable}>
                        <th if={opts.selection}></th>
                        <th each="{ colkey, colval in opts.tableHeader }" data-type="{colval.type}">
                           <small> <input type="text" name="filter_{ colkey }" placeholder="filter { colkey }"></small>
                        </th>
                        <th>&nbsp;</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>

    <!-- <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/zf/dt-1.10.12/datatables.min.css"> -->
    <link href="https://cdn.datatables.net/v/bs/dt-1.10.13/b-1.2.4/b-colvis-1.2.4/b-flash-1.2.4/b-html5-1.2.4/b-print-1.2.4/cr-1.3.2/fc-3.2.2/fh-3.1.2/kt-2.2.0/r-2.1.0/rr-1.2.0/sc-1.4.2/se-1.2.0/datatables.min.css" rel="stylesheet">
    <link href="/bower_components/gentelella/vendors/datatables.net-bs/css/dataTables.bootstrap.min.css" rel="stylesheet">
    <link href="/bower_components/gentelella/vendors/datatables.net-buttons-bs/css/buttons.bootstrap.min.css" rel="stylesheet">
    <link href="/bower_components/gentelella/vendors/datatables.net-fixedheader-bs/css/fixedHeader.bootstrap.min.css" rel="stylesheet">
    <link href="/bower_components/gentelella/vendors/datatables.net-responsive-bs/css/responsive.bootstrap.min.css" rel="stylesheet">
    <link href="/bower_components/gentelella/vendors/datatables.net-scroller-bs/css/scroller.bootstrap.min.css" rel="stylesheet">
    <style>
        .btn-group {
          display: flex;
          float: right;
        }
        table.dataTable th.focus, table.dataTable td.focus {
            outline: 2px solid silver!important;
            outline-offset: -1px;
        }
    </style>

    <script>
        var self = this;
        self.mixin(FeatherClientMixin);

        self.dependencies = [
            'https://cdn.datatables.net/v/bs/dt-1.10.13/b-1.2.4/b-colvis-1.2.4/b-flash-1.2.4/b-html5-1.2.4/b-print-1.2.4/cr-1.3.2/fc-3.2.2/fh-3.1.2/kt-2.2.0/r-2.1.0/rr-1.2.0/sc-1.4.2/se-1.2.0/datatables.min.js'
            // '/bower_components/gentelella/vendors/datatables.net/js/jquery.dataTables.min.js',
            // '/bower_components/gentelella/vendors/datatables.net-bs/js/dataTables.bootstrap.min.js',
            // '/bower_components/gentelella/vendors/datatables.net-buttons/js/dataTables.buttons.min.js',
            // '/bower_components/gentelella/vendors/datatables.net-buttons-bs/js/buttons.bootstrap.min.js',
            // '/bower_components/gentelella/vendors/datatables.net-buttons/js/buttons.flash.min.js',
            // '/bower_components/gentelella/vendors/datatables.net-buttons/js/buttons.html5.min.js',
            // '/bower_components/gentelella/vendors/datatables.net-buttons/js/buttons.print.min.js',
            // '/bower_components/gentelella/vendors/datatables.net-fixedheader/js/dataTables.fixedHeader.min.js',
            // '/bower_components/gentelella/vendors/datatables.net-keytable/js/dataTables.keyTable.min.js',
            // '/bower_components/gentelella/vendors/datatables.net-responsive/js/dataTables.responsive.min.js',
            // '/bower_components/gentelella/vendors/datatables.net-responsive-bs/js/responsive.bootstrap.js',
            // '/bower_components/gentelella/vendors/datatables.net-scroller/js/datatables.scroller.min.js',
            // '/bower_components/gentelella/vendors/jszip/dist/jszip.min.js',
            // '/bower_components/gentelella/vendors/pdfmake/build/pdfmake.min.js',
            // '/bower_components/gentelella/vendors/pdfmake/build/vfs_fonts.js'
        ];

        self.refresh = function(query) {
            console.info('Datatable REFRESH ' + query);
            self.datatable.draw();
        }
        self.on('*', (event) => {
            console.info('Datatable event ' + opts.service, event);
        })
        self.on('before-unmount', () => {
            self.datatable.destroy();
        })


        self.on('updated', function(params, options) {
            if(opts.tableHeader) {
                self.initTable();
            }
        })

        self.on('before-mount', function(params, options) {
            RiotCrudController.loadDependencies(self.dependencies,'crud-datatables', function (argument) {

                 self.service.get('schema').then((result) => {
                        opts.schema = result;
                        opts.tableHeader = opts.schema.defaultProperties || opts.schema.required || opts.schema.properties;
                        console.info('Datatable before-mount opts.tableHeaderTest', opts.tableHeader);
                        self.update();
                        // self.initTable();
                    }).catch((error) => {
                        console.error('console.errorconsole.errorconsole.errorconsole.error')
                    });
            });
        });

        /**
         * Init Datatable
         */
        self.initTable = function() {
            try {
                self.datatable = $('#datatable').DataTable(self.getDatatableConfig());
            } catch(e) {
                console.log(e);
            }
        }

        /**
         * Get datatable configuration
         */
        self.getDatatableConfig = function() {
            var config = {
                order: [[0,'asc']],
                columns: [],
                // "ajax": opts.baseUrl + '/' + opts.model,
                "processing": true,
                "serverSide": true,
                // dom: "Bfrtip",
                // select:true,
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
                "fnServerData": self._fnServerData
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
                            // return '<input type="checkbox" value="'+ row[opts.idField] + '"/>';
                            return '<input type="checkbox" id="basic_checkbox_' + row[opts.idField] + '" value="'+ row[opts.idField] + '">' +
                                    '<label  data-value="0" for="basic_checkbox_' + row[opts.idField] + '"></label>';
                        }
                    }
                )
                config.order = [[1, 'asc']];
            }

            opts.columns =  opts.columns ||  {};
            for (var i = 0;i < opts.tableHeader.length; i++) {
                var  col = opts.columns[opts.tableHeader[i]] || {data: opts.tableHeader[i]};
                config.columns.push(col);
            }

            if(opts.buttons) {

                var viewModelKey = [self.opts.service, self.opts.view, 'delete', 'confirmation'].join('_');
                config.columns.push(
                    {
                        "data": null,
                        "targets": -1,
                        "orderable": false,
                        // "defaultContent": "<button>Click!</button>",
                        "render": function ( data, type, row ) {
                            // return data +' ('+ row.sku+')';
                            return '<td>' +
                                    '<a href="#/' + opts.service  + '/view/' + row[opts.idField] + '">' +
                                        '<i class="material-icons col-grey">pageview</i>' +
                                    '</a>' +
                                    '<a onclick="RiotControl.trigger(\'' + viewModelKey + '\',\''+row[opts.idField]+'\')" >' +
                                        '<i class="material-icons col-grey">delete</i>' +
                                    '</a>' +
                                '</td>';
                        }
                    }
                );
            }
            return config;
        }

        /**
         * Data Table Search Function
         */
        self._fnServerData = function ( sSource, aoData, fnCallback ) {
                /* reorganize query */
                var query = {};
                var queryObj = {};
                for (var i = aoData.length - 1; i >= 0; i--) {
                    // console.log('CRUD-datatables aoData[i].name',aoData[i].name);
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
                    query.$or = [];
                    for (var i = 0;i < opts.tableHeader.length; i++) {
                        let q = {};
                        q[opts.tableHeader[i]] = {$search: queryObj.search.value.value};
                        query.$or.push(q);
                    }
                }

                self.service.find({query:query}).then(function(result){

                    fnCallback({
                        error: false,
                        recordsTotal: result.total,
                        recordsFiltered: result.total,
                        data: result.data
                    })
                }).catch(function(error){
                    console.error('Error crud-datatables  find', error);
                    fnCallback({
                        error: error
                    })
                });
        }

        self.datatableSearch = (e) => {
                self.datatable
                    .search( e.target.value )
                    .draw();
        }


        self.rowSelection =  function(e) {
            // console.log(e);
            // alert($(e.target).attr('selected'))
        }

    </script>

</crud-datatables>