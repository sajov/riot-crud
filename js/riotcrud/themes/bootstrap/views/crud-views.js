riot.tag2('raw', '<span></span>', '', '', function(opts) {
	this.root.innerHTML = opts.content
});

riot.tag2('crud-action-menu', '<div class="btn-group"> <a each="{action in opts.actions}" if="{action.active}" onclick="{click}" class="btn btn-{action.buttonClass || \'default\'} {dropdown-menu: action.options} btn-sm"> {action.label} </a> </div>', '', '', function(opts) {
				var self = this;
				this.mixin(viewActionsMixin);
				self.on('mount', () => {
					console.warn('crud-action-menu', self.opts.actioMenu);
					console.warn('crud-action-menu', self.opts.action);
					console.warn('crud-action-menu', self.opts);

				})
});


riot.tag2('crud-header-dropdown', '<ul class="header-dropdown m-r--5"> <li class="dropdown"> <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_vert</i> </a> <ul class="dropdown-menu pull-right"> <li each="{action in opts.actions}"> <a onclick="{click}"> <i if="{action.name == \'create\'}" class="material-icons">add</i> <i if="{action.name == \'view\'}" class="material-icons">view_compact</i> <i if="{action.name == \'delete\'}" class="material-icons">remove</i> <i if="{action.name == \'edit\'}" class="material-icons">create</i> <i if="{action.name == \'save\'}" class="material-icons">save</i> <i if="{action.name == \'list\'}" class="material-icons">list</i> <span> {action.label} </span> </a> </li> </ul> </li> </ul>', '', '', function(opts) {
		var self = this;
		this.mixin(viewActionsMixin);
		self.on('mount', () => {
			console.warn('crud-action-menu', self.opts.actioMenu);
			console.warn('crud-action-menu', self.opts.action);
			console.warn('crud-action-menu', self.opts);

		})
});
riot.tag2('crud-table', '<modal-delete-confirmation></modal-delete-confirmation> <div class="card"> <div class="header"> <h2>{opts.title}<small>{opts.subtitle}</small></h2> <crud-header-dropdown if="{opts.actionMenu !== false}" service="{opts.service}" name="{opts.name}" views="{opts.views}" view="{opts.view}" query="{opts.query}" buttons="{opts.buttons}"></crud-header-dropdown> <div class="input-group" style="margin-bottom:0px"> <span onclick="{search}" class="input-group-addon"> <i class="material-icons">search</i> </span> <div class="form-line"> <input type="text" onkeyup="{search}" class="form-control date" placeholder="search for ..."> </div> </div> </div> <div class="body"> <div class="table-responsive"> <table id="{opts.service}_table" class="table table-striped jambo_table bulk_action"> <thead> <tr> <th if="{opts.selection != false}" style="width:40px;vertical-align: text-top" nowrap data-colkey="rowSelection" riot-style="{columnWidths[\'rowSelection\'] ? \'width:\' + columnWidths[\'rowSelection\'] + \'px\': \'\'}"> <input type="checkbox" id="basic_checkbox_all" __checked="{\'checked\': selection.length ==  data.data.length}"> <label onclick="{selectall}" data-value="{selection.length ==  data.data.length ? 1 : 0}" for="basic_checkbox_all"></label> </th> <th each="{colkey, colval in thead}" data-colkey="{colkey}" onclick="{sort}" riot-style="{columnWidths[colkey] ? \'width:\' + columnWidths[colkey] + \'px\': \'\'}"> <i if="{colval.type == \'string\'}" class="material-icons font-14 pull-right">sort_by_alpha</i> <i if="{colval.type != \'string\'}" class="material-icons font-14 pull-right">sort</i> <span>{colkey}</span> </th> <th data-colkey="filter" riot-style="{columnWidths[\'filter\'] ? \'width:\' + columnWidths[\'filter\'] + \'px\': \'\'}"> <i onclick="{toggleFilter}" class="material-icons">filter_list</i> </th> </tr> </thead> <tbody> <tr class="{\'hide\': !showFilter}"> <td if="{opts.selection != false}" nowrap>&nbsp;</td> <td each="{colkey, colval in thead}"> <input if="{schema.properties[colkey].type!=\'data\'}" type="text" name="{colkey}" onchange="{filter}" placeholder="enter serach"> <input if="{schema.properties[colkey].type==\'date\'}" name="{colkey}" onchange="{filter}" placeholder="enter serach" type="date"> </td> <td>&nbsp;</td> </tr> <tr each="{row in data.data}" class="{\'selected\': selection.indexOf(row._id) != -1}"> <td if="{opts.selection != false}" class="a-center"> <input data-value="{row._id}" onclick="{selectRow}" type="checkbox" id="basic_checkbox_{row._id}" __checked="{\'checked\': selection.indexOf(row._id) != -1}"> <label data-value="{row._id}" onclick="{selectRow}" data-value="{selection.length ==  data.data.length ? 1 : 0}" for="basic_checkbox_{row._id}"></label> </td> <td each="{colkey, colval in thead}"> {row[colkey]} </td> <td> <a onclick="{viewRow}"> <i class="material-icons col-grey">pageview</i> </a> <a onclick="{deleteRow}"> <i class="material-icons col-grey">delete</i> </a> </td> </tr> </tbody> </table> </div> <div class="clearfix"></div> <nav if="{pagination.length > 0}" aria-label="Page navigation" class="pull-right"> <ul class="pagination"> <li each="{page in pagination}" class="{\'disabled\':page.active == false}"> <a href="#" onclick="{paginate}" class="{\'disabled\':page.active == false}"> <i class="{page.class}"></i>{page.label} </a> </li> </ul> </nav> <div class="clearfix"></div> <yield></yield> </div> </div> <div> </div> <div class="clearfix"></div>', 'th { white-space: nowrap } .selectbox { font-size: 150%; } .pagination { margin: 0px 0 10px 0 ; } td { max-width: 100px; white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word; }', '', function(opts) {

		var self = this;
		self.opts.view = 'list';
		self.pagination = [];
		self.query = {
			$limit: opts.limit || 10,
            $skip: opts.skip || 0,
            $sort: {}
		};
		self.selection = [];
		self.showFilter = false;

		this.mixin(FeatherClientMixin);

		self.on('mount', () => {
			console.info('CRUD-TABLE self', self);
			console.info('CRUD-TABLE SCHEMA',self.opts.schema);
			console.info('CRUD-TABLE service', self.service);
			if(self.opts.service) {
				initTable();
			}
		});

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

            if(e.target.value !== "") {
                self.query.$or = [];
                console.log('self.thead',self.thead.length);
                let theadFields = Object.keys(self.thead);
                for (var i = 0;i < theadFields.length; i++) {
                    let q = {};
                    q[theadFields[i]] = {$search: e.target.value};
                    self.query.$or.push(q);
                }
            } else {
            	delete self.query.$or;
            }
            getData();
	    }

	    filter = (e) => {
	    	delete self.query.$or;
	    	console.error(self.schema,'self.schema')

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
    		getData();
	    }

	    toggleFilter = (e) => {
	    	self.showFilter = self.showFilter == true ? false : true;
	    	self.update();
	    }

	    sort = (e) => {
	    	console.log(e.item);
	    	if(self.query.$sort[e.item.colkey]) {
            	self.query.$sort[e.item.colkey] = self.query.$sort[e.item.colkey] == 1 ? -1 : 1;
	    	} else {
	    		self.query.$sort = {};
            	self.query.$sort[e.item.colkey] = -1;
	    	}
	    	self.theadSort = self.query.$sort[e.item.colkey] == 1 ? 'asc' : 'desc';

            getData();
	    }

		selectall = (e) => {
			if (self.selection.length == self.data.data.length) {
				self.selection = [];
			} else {
				self.selection = self.data.data.reduce(function(prev, curr) {
				  return prev.concat(curr._id);
				}, []);

			}

		}

		selectRow = (e) => {
			let value = e.item.row._id;
			let index = self.selection.indexOf(value);
			if (index !== -1) {
				self.selection.splice(index,1);
			} else{
				self.selection.push(value)
			}

		}

		deleteRow = (e) => {
			e.preventDefault();
			RiotControl.trigger([self.opts.service, self.opts.view, 'delete','confirmation'].join('_'), e.item.row._id)
		}

		viewRow = (e) => {
			e.preventDefault();
			riot.route(opts.service + '/view/' + e.item.row._id);
		}

	    initSchema = () => {
	    	self.thead = {};
		    if(opts.fields) {
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

	    initTable = () => {
	    	self.service.get('schema').then((result) => {
	        	self.schema = result;
	        	initSchema();
	    		getData();
	        }).catch((error) => {
	          console.error('Error', error);
	        });
	    }

	    self.refresh = () => {
	    	getData();
	    }

	    initColumnWidth = () => {
	    	if(!self.columnWidths) {
	    		self.columnWidths = {};
	    		$('#orders_table th').each(function(){
	    			console.warn($(this).data('colkey'));
	    			console.warn($(this).width());
	    			self.columnWidths[$(this).data('colkey')] = $(this).width();
	    		})
	    		self.columnWidths[rowSelection] = 40;
	    		console.error(self.columnWidths)
	    	}
	    }

	    initPagination = () => {
	    	self.pagination = [];
	    	self.pagecount = 5;

    		let start = 1;
    		let end = (Math.ceil(self.data.total/self.data.limit))-1;

    		if(self.data.skip > 0){
    			start = Math.ceil(self.data.skip/self.data.limit);
    		}

    		if(start > 0 && end > 0) {
			    console.info('RANGE start-end',start+ ' - ' + end + ' ??? ' + start+self.pagecount + ' > ' + end);

    			self.pagination.push({label:'', class:'fa fa-angle-double-left',active: self.data.skip == 0,skip:0})

	    		if((start+self.pagecount) > (end-1)) {
	    			start = end-4;
	    		}
		    	let range = Array.apply(start, Array(self.pagecount))
			        .map(function (element, index) {

			          return index + start;
			    });

			    for (var i = 0; i < range.length; i++) {
			    		if(range[i] > 0) {
		    				self.pagination.push({label:range[i],skip:range[i]*self.data.limit})
			    		}
			    }

	    		self.pagination.push({label:'', class:'fa fa-angle-double-right', active: (self.data.skip * self.data.skip == 0), skip: end*self.data.limit})
		    	console.warn('RANGE',range,self.pagination);
    		}
	    }

	    paginate = (e) => {
	    	e.preventDefault();
	    	self.query.$skip = e.item.page.skip;
	    	console.log(e.item.page.skip);
	    	getData();
	    }

	    getData = () => {
	    	if(self.data)
	    		initColumnWidth();
	        self.service.find({query:self.query}).then((result) => {
	        	self.selection = [];
	            self.data = result;
	            initPagination();
	    		console.log('get data',self.query, result);
	    		self.update();
	        }).catch((error) => {
	          console.error('Error', error);
	        });
	    }
});

