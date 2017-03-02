<raw>
	<span></span>
	this.root.innerHTML = opts.content
</raw>

<crud-test>
	<script>
		var self = this;
		this.on('*', (event) => {
			console.info('CRUD-TEST: ' + event, opts.name)
		});
	</script>
</crud-test>

<crud-action-menu>

	<div class="btn-group">
		<a each={action in opts.actions} if={ action.active} onclick={ click } class="btn btn-{ action.buttonClass || 'default'} {dropdown-menu: action.options} btn-sm">
			{action.label}
		</a>
	</div>
	<script>
		// this.mixin('viewActionsMixin');
	</script>
</crud-action-menu>

<crud-modal-dialog>

    <div id="modal-dialog" class="modal fade bs-example-modal-{ opts.size || 'lg'}" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-{ opts.size || 'lg'}">
        <div class="modal-content">

           <div class="modal-header">
                <button type="button" class="close waves-effect" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                <h4 class="modal-title" id="myModalLabel2">{ opts.title }</h4>
            </div>


            <div class="modal-body">
                <yield from="body"/>
            </div>
            <div class="modal-footer">
                <yield from="footer"/>
            </div>

        </div>
      </div>
    </div>

    <style type="text/css">
        #modal-dialog .card{
            /*border: 1px #909090 solid;*/
            box-shadow: none;
        }
        #modal-dialog .card .body {
            font-size: 14px;
            color: #555;
            padding: 0;
        }
    </style>
    <script>

        this.on('mount', () => {
            RiotControl.on(opts.trigger, () => {
                $('#modal-dialog').modal('toggle');
            });
        });

        this.on('unmount', () => {
            RiotControl.off(opts.trigger);
        });

    </script>

</crud-modal-dialog>


<crud-header-dropdown>
	<modal-delete-confirmation></modal-delete-confirmation>
    <crud-modal-dialog if={opts.view == 'list'} title="Upload {opts.title}" service="{opts.service}" trigger="{opts.service}_upload_modal" trigger-submit="fg">
        <yield to="body">
            <crud-upload service="{opts.service}" title="{opts.name}"></crud-upload>
        </yield>
        <yield to="footer">
            <button type="button" class="btn btn-info  waves-effect" data-dismiss="modal"  onclick={abort}>Close</button>
        </yield>
    </crud-modal-dialog>
	<ul class="header-dropdown m-r--5">
        <li class="dropdown">
            <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <i class="material-icons">more_vert</i>
            </a>
            <ul class="dropdown-menu pull-right">
                <li each={action in opts.actions}>
	        		<a if={action.active} href="#" onclick={ actionClick }>

		        		<i if={action.name == 'create'} class="material-icons">add</i>
						<i if={action.name == 'view'} class="material-icons">view_compact</i>
						<i if={action.name == 'delete'} class="material-icons">remove</i>
						<i if={action.name == 'edit'} class="material-icons">mode_edit</i>
						<i if={action.name == 'save'} class="material-icons">save</i>
						<i if={action.name == 'list'} class="material-icons">view_list</i>
						<i if={action.name == 'print'} class="material-icons">local_printshop</i>
						<i if={action.name == 'pdf'} class="material-icons">picture_as_pdf</i>
						<i if={action.name == 'csv'} class="material-icons">insert_drive_file</i>
						<i if={action.name == 'json'} class="material-icons">insert_drive_file</i>

						<hr style="margin:0;" if={action.name == 'upload'} />
						<i if={action.name == 'upload'} class="material-icons">file_upload</i>

						<span  if={action.active}  class="{action.count === 0 ? 'font-line-through font-italic' : 'font-bold'}">
		        			{action.label}
		        			<small if={action.count >= 0}>({action.count})</small>
		        		</span>
		        	</a>
	        	</li>
            </ul>
        </li>
    </ul>
    <!-- <a  href="#" onclick={ actionClickLocal }>local</a>
    <a  href="#" onclick={ actionClickMixin }>mixin</a> -->

	<script>
		var self = this;
		this.mixin('ViewActionsMixin');

        actionClickLocal = function(e) {
            e.preventDefault();
            console.info('actionClickLocal', this.opts)
        }
	</script>

</crud-header-dropdown>

<modal-delete-confirmation>

    <!-- Small modal -->
    <div id="deleteConfirmation" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">

          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span>
            </button>
            <h4 class="modal-title" id="myModalLabel2">Delete <i>{opts.model} </i></h4>
          </div>
          <div class="modal-body">
            ID: {opts.id}
            <br>
            {opts.text}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Abbort</button>
            <button type="button" class="btn btn-danger" onclick="{confirm}">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <link href="/bower_components/adminbsb-materialdesign/plugins/sweetalert/sweetalert.css" rel="stylesheet" />
    <!-- /modals -->
    <style type="text/css">
        div.modal-backdrop.fade.in {
            z-index: 7!important;
        }
        div.modal-body {
            word-break: break-all;
        }
    </style>
    <script>
        var self = this;
        // self.dependencies = ['/bower_components/adminbsb-materialdesign/plugins/sweetalert/sweetalert.min.js'];

        RiotControl.on('delete_confirmation_modal', (model, view, id, text) => {
            self.opts.model = model;
            self.opts.view = view;
            self.opts.id = id;
            self.opts.text = text || 'please confirm';
            self.update();
            $('#deleteConfirmation').modal('show');
            // swal({
            //     title: "Are you sure?",
            //     text: "You will not be able to recover this imaginary file!",
            //     type: "warning",
            //     showCancelButton: true,
            //     confirmButtonColor: "#DD6B55",
            //     confirmButtonText: "Yes, delete it!",
            //     closeOnConfirm: false
            // }, function () {
            //     swal("Deleted!", "Your imaginary file has been deleted.", "success");
            // });
        })

        confirm() {
            RiotControl.trigger([opts.model, opts.view, 'delete'].join('_'), opts.id);
            $('#deleteConfirmation').modal('hide');
        }

    </script>

</modal-delete-confirmation>

<crud-table>

	<style type="text/css">
		th {
			white-space: nowrap
		}

		table input {
			width: 100%;
		}

		.selectbox {
			font-size: 150%;
		}

		.pagination {
			margin: 0px 0 10px 0 ;
		}
		.basic_checkbox_all {
			top:10px;
		}
		.table-responsive td{
			/*white-space:nowrap;overflow: hidden; width: 200px;*/
			max-width: 100px;
		    overflow: hidden;
		    text-overflow: ellipsis;
		    white-space: nowrap;
		}
		.table-responsive i.material-icons {
			color:#999;
			position: relative;
			top: 6px;
		}
		.NOtd {
		  max-width: 100px;
		  white-space: pre-wrap;        /* css */
		  white-space: -moz-pre-wrap;   /* Mozilla */
		  white-space: -pre-wrap;       /* Chrome*/
		  white-space: -o-pre-wrap;     /* Opera 7 */
		  word-wrap: break-word; /* Internet Explorer 5.5+ */
		}
	</style>

	<div class="card">
        <div if={opts.showheader == 1 || opts.showheader == true} class="header">
            <h2>{opts.title}<small>{opts.description}</small></h2>
            <span if={selection.length > 0} class="label-count bg-pink font-6">{selection.length}</span>
            <crud-header-dropdown if={opts.actionMenu !== false} selection="{selection.length}" service="{opts.service}" name="{opts.name}" title="{opts.title}" views="{opts.views}" view="{opts.view}" query="{opts.query}" buttons="{opts.buttons}"></crud-header-dropdown>
        </div>

        <div class="body">
        	<div class="input-group" style="margin-bottom:0px">
            	<span onclick={ search }  class="input-group-addon">
                	<i class="material-icons">search</i>
            	</span>
            	<div class="form-line">
                	<input type="text" onkeyup={ search } class="form-control date" placeholder="search for ...">
            	</div>
        	</div>
			<!-- TABLE -->
			<div class="table-responsive">
				<table id="{ opts.service }_table" class="table table-striped jambo_table bulk_action">
				    <thead>
				      <tr >
				      	<th if={ opts.selection != false } style="width:40px;vertical-align: text-top" nowrap data-colkey="rowSelection">
		      			    <input if={selection.length ==  data.data.length} type="checkbox" class="filled-in chk-col-{color}" id="basic_checkbox_{selection.length ==  data.data.length ? 'all' : ''}" checked="checked">
		      			    <input if={selection.length !=  data.data.length} type="checkbox" class="filled-in chk-col-{color}" id="basic_checkbox_{selection.length !=  data.data.length ? 'all' : ''}" >
	                        <label onclick={ selectall }  data-value="{ selection.length ==  data.data.length ? 1 : 0 }" for="basic_checkbox_all" class="basic_checkbox_all"></label>
						</th>
				        <th each="{ colval, colkey in thead }" data-colkey="{colkey}" onclick={ sort }>
				        	<label>{ colkey }</label>
				        	<i if={query.$sort[colkey] && query.$sort[colkey] == '-1'} class="material-icons">keyboard_arrow_down</i>
				        	<i if={query.$sort[colkey] && query.$sort[colkey] == '1'} class="material-icons">keyboard_arrow_up</i>
				        </th>
				        <th data-colkey="filter" >
				        	<i onclick={ toggleFilter } class="material-icons">filter_list</i>
				        </th>
				      </tr>
				    </thead>
				    <tbody>
				    	<tr class="{'hide': !showfilter}">
					      	<td if={ opts.selection != false } nowrap>&nbsp;</td>
					        <td each="{ colval, colkey in thead }">
					        	<input if={schema.properties[colkey].type!='data'} type="text" name="{ colkey }" onchange={filter} placeholder="enter serach">
					        	<input if={schema.properties[colkey].type=='date'} type="date" name="{ colkey }" onchange={filter} placeholder="enter serach">
					        </td>
					        <td>&nbsp;</td>
				      	</tr>
				      	<tr each="{ row in data.data }" onclick={ selectRow } class="{ 'selected': selection.indexOf(row._id) != -1 }">
					      	<td if={ selection !== false } class="a-center">
					      		<div if="{selection.indexOf(row._id) > -1}">
					      			<input  data-value="{ row._id }" type="checkbox" class="filled-in chk-col-{color}" id="basic_checkbox_on_{row._id}" checked="checked">
	                       			<label data-value="{ row._id }" onclick={ selectRow }  data-value="{ selection.length ==  data.data.length ? 1 : 0 }" for="basic_checkbox_on_{row._id}"></label>
					      		</div>
					      		<div if="{selection.indexOf(row._id) === -1}">
					      			<input data-value="{ row._id }" type="checkbox" id="basic_checkbox_{row._id}">
	                       			<label data-value="{ row._id }" onclick={ selectRow }  data-value="{ selection.length ==  data.data.length ? 1 : 0 }" for="basic_checkbox_{row._id}"></label>
					      		</div>
							</td>
					        <td  data-value="{ row._id }" each="{ colval, colkey in thead }">
					        	{ row[colkey] }
					        </td>
					      	<td>
                                <a href="#" onclick={viewRow} >
                                    <i class="material-icons col-grey">pageview</i>
                                </a>
                                <a href="#" onclick={deleteRow} >
                                    <i class="material-icons col-grey">delete</i>
                                </a>
					      	</td>
					    </tr>
				    </tbody>
			    </table>
			</div>
			<!-- TABLE end -->

			<div class="clearfix"></div>

			<div if={opts.showlimit} class="pull-left btn-group dropup">
                <button if={data.data} type="button" class="btn btn-default waves-effect">{opts.limit || data.limit} / {data.total}</button>
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    <span class="caret"></span>
                    <span class="sr-only">Toggle Dropdown</span>
                </button>
                <ul class="dropdown-menu">
                    <li><a href="#" onclick={changeLimit} data-limit="5" class="waves-effect waves-block">5</a></li>
                    <li><a href="#" onclick={changeLimit} data-limit="10" class="waves-effect waves-block">10</a></li>
                    <li><a href="#" onclick={changeLimit} data-limit="50" class="waves-effect waves-block">50</a></li>
                    <li><a href="#" onclick={changeLimit} data-limit="100" class="waves-effect waves-block">100</a></li>
                    <li role="separator" class="divider"></li>
                    <li><a href="#" onclick={changeLimit} data-limit="ALL" class="waves-effect waves-block">ALL</a></li>
                </ul>
            </div>
	        <div if={opts.showpagination} class="pull-right btn-toolbar">
				<div if={pagination.start} class="btn-group" role="group" aria-label="First group">
		            <button onclick={paginate} data-page="{pagination.start}" type="button" class="btn btn-{pagination.current ==  pagination.start ? 'info' : 'default'} waves-effect">{pagination.start}</button>
		        </div>
				<div class="btn-group" role="group" aria-label="First group">
		            <button each={page in pagination.range} onclick={paginate} type="button" data-page="{page}" class="btn NObtn-{pagination.current == page ? 'info' : 'default'} {'disabled':page.active == false} btn-{pagination.current != page ? 'default' : ''} bg-{pagination.current == page ? color : ''} waves-effect">{page}</button>
		        </div>
		        <div if={pagination.end} class="btn-group" role="group" aria-label="First group">
		            <button onclick={paginate} data-page="{pagination.end}" type="button" class="btn btn-{pagination.current == pagination.end ? 'info' : 'default'}  waves-effect">{pagination.end}</button>
		        </div>
	        </div>
			<div class="clearfix"></div>

			<!-- <yield from="buttons"/> -->
			<yield />
        </div>
    </div>

	<div class="clearfix"></div>

	<script>

		var self = this;
		self.opts.view = 'list';
		self.opts.showheader = true;
		self.opts.showfilter = true;
		self.opts.showpagination = true;
		self.opts.showlimit = true;
		self.pagination = {
			range:[]
		};
		self.query = {
			$limit: opts.limit || 10,
            $skip: opts.skip || 0,
            $sort: JSON.parse('{"' + (opts.sortfield || opts.idfield) + '":' + (opts.sortdir || 1) + '}'),
		};
		self.data = {
			'limit': opts.limit,
			'skip': opts.skip,
			'total': 0,
			data:[]
		};
		self.selection = [];
		self.selectionLength = [];
		self.showfilter = false;

		self.color = $('body').attr('class').replace('theme-','');
        $('.right-sidebar .demo-choose-skin li').on('click', function () {
            self.color = $('body').attr('class').replace('theme-','');
            self.update();
        });


		self.mixin('FeatherClientMixin');

        RiotControl.on(opts.service + '_list_update', function() {
            self.reInit();
        });
        /* deprecated use reInit */
	    /* merge request params over self.query move to mixin */
	    self.refresh = (opts) => {
            if(opts.query.id!="") {
                self.query.id = opts.query.id
            } else if(opts.query && opts.query.query && opts.query.query.query){
                console.error('opts.query.query',opts.query.query, JSON.parse(opts.query.query.query))
                self.query = JSON.parse(opts.query.query.query);
                // self.query = opts.query.query;
                // self.query = decodeURIComponent(opts.query.query.query);
            }
            getData();

        }

        /**
         * Reinit view
         * list, edit and show requery
         * @param  {[type]} query [description]
         * @return {[type]}       [description]
         */
        self.reInit = (query) => {
            getData();
        }

        self.on('mount', () => {
            if(self.opts.service) {
                initTable();
            }
        });

        initTable = () => {
            self.service.get('schema').then((result) => {
                self.schema = result;
                initSchema();
                getData();
            }).catch((error) => {
              console.error('Error', error);
            });
        }

        initSchema = () => {
            self.thead = {};
            if(opts.fields) {
                opts.fields = opts.fields.split(',');
                for (var i = 0; i < opts.fields.length; i++) {
                    self.thead[opts.fields[i]] = self.schema.properties[opts.fields[i]]
                }
            } else if(self.schema.defaultProperties) {
                for (var i = 0; i < self.schema.defaultProperties.length; i++) {
                    self.thead[self.schema.defaultProperties[i]] = self.schema.properties[self.schema.defaultProperties[i]]
                }
            } else {
                self.thead = self.schema.properties;
            }
        }

		triggerData = (e) => {
			RiotControl.trigger(e.target.getAttribute('data-trigger'),
				self.data.data.reduce(function(prev, curr) {
					if (self.selection.indexOf(curr._id) === -1)
						return prev;
					return prev.concat(curr);
				}, [])
			)
			self.selection = [];
		}

	    search = (e) => {
             /* search */
            if(e.target.value !== "") {
                self.query.$or = [];
                let theadFields = Object.keys(self.thead);
                for (var i = 0;i < theadFields.length; i++) {
                    let q = {};
                    q[theadFields[i]] = {$search: e.target.value};
                    self.query.$or.push(q);
                }
            } else {
            	delete self.query.$or;
            }
            updateRoute();
	    }

	    filter = (e) => {
	    	delete self.query.$or;
	    	if(e.target.value !== "") {
	    		let value = e.target.value
	    		if(self.schema && self.schema.properties[e.target.name] && self.schema.properties[e.target.name].type) {
	    			if(self.schema.properties[e.target.name].type === 'number') {
	    				value = value * 1;
	    			}
	    		}
    			self.query[e.target.name] = value;
	    	} else {
	    		delete self.query[e.target.name];
	    	}
    		updateRoute();
	    }

	    toggleFilter = (e) => {
	    	self.showfilter = self.showfilter == true ? false : true;
	    	self.update();
	    }

	    sort = (e) => {
	    	if(self.query.$sort[e.item.colkey]) {
            	self.query.$sort[e.item.colkey] = self.query.$sort[e.item.colkey] == 1 ? -1 : 1;
	    	} else {
	    		self.query.$sort = {};
            	self.query.$sort[e.item.colkey] = -1;
	    	}
	    	self.theadSort = self.query.$sort[e.item.colkey] == 1 ? 'asc' : 'desc';

            updateRoute();
	    }

		selectall = (e) => {
			e.preventDefault();
			if (self.selection.length == self.data.data.length) {
				self.selection = [];
			} else {
				self.selection = self.data.data.reduce(function(prev, curr) {
				  return prev.concat(curr._id);
				}, []);
			}
			self.update();
		}

		selectRow = (e) => {
			let value = e.item.row._id;
			let index = self.selection.indexOf(value);
			if (index !== -1) {
				self.selection.splice(index,1);
			} else{
				self.selection.push(value)
			}
            RiotControl.trigger([self.opts.service, 'query' ].join('_'), e.item.row._id)
		}

        triggerSelect = (e) => {
            console.log('triggerSelect', e.item)
        }

		deleteRow = (e) => {
			e.preventDefault();
			RiotControl.trigger([self.opts.service, self.opts.view, 'delete','confirmation'].join('_'), e.item.row._id)
		}

		viewRow = (e) => {
			e.preventDefault();
			route(opts.service + '/view/' + e.item.row._id);
		}



	    initPagination = () => {
	    	self.next = 2;
	    	let current = (Math.ceil(self.data.skip/self.data.limit)) || 1;
    		let start = 1;
    		let end = (Math.ceil(self.data.total/self.data.limit))-1;
    		let nextTo = 2;
	    	let rangeStart = current - nextTo;
	    	let rangeEnd = current + nextTo;

	    	if(rangeStart <= 0) {
	    		rangeStart = start;
	    	}
	    	if(rangeEnd >= end) {
	    		rangeEnd = end;
	    	}

	    	self.pagination = {
	    		start:rangeStart == start ? false : 1,
	    		rangeStart:rangeStart,
	    		current:current,
	    		rangeEnd:rangeEnd,
	    		range:[],
	    		end:rangeEnd == end ? false : end
	    	};

	    	for (var i = rangeStart; i <= rangeEnd; i++) {
	    		self.pagination.range.push(i);
	    	}
	    }

	    paginate = (e) => {
	    	e.preventDefault();
	    	self.query.$skip = parseInt(e.target.getAttribute('data-page')) * self.query.$limit;
	    	updateRoute();
	    }

	    changeLimit = (e)  => {
	    	e.preventDefault();
	    	let limit = e.target.getAttribute('data-limit');
	    	if(limit === 'ALL') {
	    		self.query.$limit = self.data.total;
	    	} else {
	    		self.query.$limit = parseInt(limit);
	    	}
	    	updateRoute();
	    }

        updateRoute = () => {
            var currentRoute = window.location.href;
            if(currentRoute == currentRoute.replace(self.opts.service+'/'+self.opts.view)) {
                getData();
            } else {
                var query = self.query;
                route(opts.service + '/' + opts.view + '/?query=' + JSON.stringify(query));
            }
        }

	    getData = () => {
	        self.service.find({query:self.query}).then((result) => {
	        	self.selection = [];
	            self.data = result;
	            initPagination();
	            self.update();
	        }).catch((error) => {
	          console.error('Error', error);
	        });
	    }
	</script>
</crud-table>

