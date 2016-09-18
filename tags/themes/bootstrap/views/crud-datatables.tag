<crud-datatables>
    <div class="container">
dsadas
        <crud-top-bar></crud-top-bar>

        <br>
        <br>

        <table id="ajaxdatatables" class="display" cellspacing="0" width="100%">
            <thead><tr></tr></thead>
            <tfoot><tr></tr></tfoot>
        </table>

<!--         <virtual each={ field in this.VM.config.fields }>
          <a>{ field.title }</a>
        </virtual>
 -->
    </div>

    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/zf/dt-1.10.12/datatables.min.css">

    <script>
        var tag = this;

        tag.refresh = function(params, options) {
            alert('refresh',params, options);
            // tag.mergeParams(params);
            // riotux.trigger(tag.VM.modelStore,'list',{tag:tag.root.getAttribute('riot-tag'), params:params});
        }

        tag.on('mount', function() {
            console.log('datatables mount', tag);

            if(typeof this.VM.rows === 'undefined') {
                return true;
            }
            // console.log(tag.VM.config.fields);

            datatablesColumns = [];

            /* prepare html table and config columns */
            $.each(this.VM.config.fields, function(i, field){
                datatablesColumns.push({data:field.name});
                $('#ajaxdatatables tr').append('<th>' + field.title + '</th>');
            })

console.log('datatablesColumns',datatablesColumns);

            $('#ajaxdatatables').DataTable({
                "ajax": this.VM.config.baseUrl + '/' + this.VM.model,
                "processing": true,
                "serverSide": true,
                "columns": [
                    { "data": "id" },
                    { "data": "sku" },
                    { "data": "name" },
                    { "data": "name" },
                ],

                "fnServerData": function ( sSource, aoData, fnCallback ) {

                    /* reorganize query */
                    var query = {};
                    var queryObj = {};
                    for (var i = aoData.length - 1; i >= 0; i--) {
                        console.log('datatables aoData[i].name',aoData[i].name);
                        queryObj[aoData[i].name] = aoData[i];
                    }

                    /* limit / offset */
                    query.limit = queryObj['length'].value;
                    query.skip = queryObj['start'].value;

                    /* sort */
                    for (var i = queryObj.order.value.length - 1; i >= 0; i--) {
                        query.sort = queryObj.columns.value[ queryObj.order.value[i].column ].data +
                                    ' ' +
                                    queryObj.order.value[i].dir;
                    }

                    /* search */
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
                       // url: tag.VM.config.baseUrl + '/' + tag.VM.model,
                       data: query,
                       success: function(data, textStatus, request){

                            fnCallback({
                                error: false,
                                recordsTotal: request.getResponseHeader('X-Total-Count'),
                                recordsFiltered: request.getResponseHeader('X-Total-Count'),
                                data: data
                            })
                       },
                       error: function (request, textStatus, errorThrown) {
                            alert(request.getResponseHeader('X-Total-Count'));
                       }
                      });

                }
            });

            $('#ajaxdatatables').removeClass( 'display' ).addClass('tdisplay');
        })

    </script>

</crud-datatables>