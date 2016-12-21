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

        this.refresh = function(params, options) {
            // console.log('datatables refresh opts', opts.title);
            // alert('refresh',params, options);
            // this.mergeParams(params);
            // riotux.trigger(this.VM.modelStore,'list',{tag:this.root.getAttribute('riot-tag'), params:params});
        }

        this.on('all', function(eventName) {
            console.info('ALL EVENTNAME',eventName)
        })

        this.on('update', function(params, options) {
            // console.log('datatables update opts', opts.title);
        });

        this.on('updated', function(params, options) {
            // console.log('datatables updated opts', opts.schema.properties);
        });

        this.on('updated', function(params, options) {
            console.error('MOIUNGFT');
            console.info('DATATABLES UPDATED');

            tag.initTable();
            tag.socket();
        });

        tag.socket = function () {
            var socket = io('http://localhost:3030');
            var client = feathers()
              .configure(feathers.hooks())
              .configure(feathers.socketio(socket));
            window.service = client.service('products');
            service.on('created', function(todo) {
                console.log('Someone created a todo', todo);
            });
            // service.create({
            //     description: 'Todo from client'
            // });
            service.find().then(function(result){
              console.log('Authenticated!', result);
              tag.datatable.rows.add(result.data)
            }).catch(function(error){
              console.error('Error authenticating!', error);
            });
        }

        this.on('mount', function() {
            console.log('DATATABLES MOUNT');
            opts.tableHeader = opts.schema.defaultProperties || opts.schema.required;
            console.error(opts.tableHeader);
        })

        /**
         * Init Datatable
         * @return {[type]} [description]
         */
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

        /**
         * Get datatable configuration
         * @return object Datatable configurytion
         */
        this.getDatatableConfig = function() {

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
                            return '<a class="btn btn-default btn-small" tabindex="0" aria-controls="ajaxdatatables" href="#product/view/' + row.id + '"><span> Edit</span></a>' +
                                    '<div class="dt-buttons btn-group"><a class="btn btn-default buttons-copy buttons-html5 btn-sm" href="#"><span> Delete</span></a></div>';
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
                // AJAX
                $.ajax({
                   type: 'get',
                   url:opts.endpoint,
                   // url: tag.VM.config.baseUrl + '/' + tag.VM.model,
                   data: query,
                   success: function(data, textStatus, request){

                    console.info('success');
                    console.info(data);
                    console.info(request);
                    console.info(request.getResponseHeader('X-Total-Count'));
                        fnCallback({
                            error: false,
                            // recordsTotal: request.getResponseHeader('X-Total-Count'),
                            // recordsFiltered: request.getResponseHeader('X-Total-Count'),
                            // data: data
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

        tag.rowSelection =  function(e) {
            // console.log(e);
            // alert($(e.target).attr('selected'))
        }

    </script>

</crud-datatables>