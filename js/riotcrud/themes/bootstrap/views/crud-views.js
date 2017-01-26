riot.tag2('raw', '<span></span>', '', '', function(opts) {
	this.root.innerHTML = opts.content
});

riot.tag2('crud-action-menu', '<div class="btn-group"> <a each="{action in opts.actions}" if="{action.active}" onclick="{click}" class="btn btn-{action.buttonClass || \'default\'} {dropdown-menu: action.options} btn-sm">{action.label} </a> </div>', '', '', function(opts) {
				var self = this;
				this.mixin(viewActionsMixin);
				self.on('mount', () => {
					console.warn('crud-action-menu', self.opts.actioMenu);
					console.warn('crud-action-menu', self.opts.action);
					console.warn('crud-action-menu', self.opts);

				})
});


riot.tag2('crud-header-dropdown', '<ul class="header-dropdown m-r--5"> <li class="dropdown"> <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_vert</i> </a> <ul class="dropdown-menu pull-right"> <li each="{action in opts.actions}"> <a onclick="{click}">{action.label}</a> </li> </ul> </li> </ul>', '', '', function(opts) {
		var self = this;
		this.mixin(viewActionsMixin);
		self.on('mount', () => {
			console.warn('crud-action-menu', self.opts.actioMenu);
			console.warn('crud-action-menu', self.opts.action);
			console.warn('crud-action-menu', self.opts);

		})
});
riot.tag2('crud-table', '<div> <div class="page-title"> <div class="title_left"> <h3>{title} <small>{description}</small></h3> </div> <div class="title_right"> <div class="col-md-4 pull-right"> <div class="input-group"> <span onclick="{search}" class="input-group-addon"> <i class="material-icons">search</i> </span> <div class="form-line"> <input type="text" onkeyup="{search}" class="form-control date" placeholder="search for ..."> </div> </div> </div> </div> </div> <div class="clearfix"></div> <div class="table-responsive"> <table id="{opts.id}" class="table table-striped jambo_table bulk_action"> <thead> <tr> <th if="{opts.selection != false}" nowrap> <input type="checkbox" id="basic_checkbox_all" checked=""> <label onclick="{selectall}" data-value="{selection.length ==  data.data.length ? 1 : 0}" for="basic_checkbox_all"></label> </th> <th each="{colkey, colval in thead}" onclick="{sort}"> {colkey} <i if="{colval.type == \'string\'}" class="material-icons font-14 pull-right">sort_by_alpha</i> <i if="{colval.type != \'string\'}" class="material-icons font-14 pull-right">sort</i> </th> <th> <i onclick="{toggleFilter}" class="material-icons">filter_list</i> </th> </tr> </thead> <tbody> <tr class="{\'hide\': !showFilter}"> <td if="{opts.selection != false}" nowrap>&nbsp;</td> <td each="{colkey, colval in thead}"> <input if="{schema.properties[colkey].type!=\'data\'}" type="text" name="{colkey}" onchange="{filter}" placeholder="enter serach"> <input if="{schema.properties[colkey].type==\'date\'}" name="{colkey}" onchange="{filter}" placeholder="enter serach" type="date"> </td> <td>&nbsp;</td> </tr> <tr each="{row in data.data}" onclick="{selectrow}" class="{\'selected\': selection.indexOf(row._id) != -1}"> <td if="{opts.selection != false}" class="a-center"> <input data-value="{row._id}" type="checkbox" id="basic_checkbox_{row._id}" __checked="{\'checked\': selection.indexOf(row._id) != -1}"> <label data-value="{row._id}" onclick="{selectall}" data-value="{selection.length ==  data.data.length ? 1 : 0}" for="basic_checkbox_{row._id}"></label> </td> <td each="{colkey, colval in thead}" onclick="{selectRow}"> {row[colkey]} </td> <td> <div class="btn-group"> <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_vert</i> </button> <ul class="dropdown-menu"> <li><a href="javascript:void(0);" class=" waves-effect waves-block">Action</a></li> <li><a href="javascript:void(0);" class=" waves-effect waves-block">Another action</a></li> <li><a href="javascript:void(0);" class=" waves-effect waves-block">Something else here</a></li> <li role="separator" class="divider"></li> <li><a href="javascript:void(0);" class=" waves-effect waves-block">Separated link</a></li> </ul> </div> </td> </tr> </tbody> </table> </div> <div class="clearfix"></div> <nav if="{pagination.length > 0}" aria-label="Page navigation" class="pull-right"> <ul class="pagination"> <li each="{page in pagination}"> <a href="#" onclick="{paginate}" class="{\'disabled\':page.active == false}"> <i class="{page.class}"></i>{page.label} </a> </li> </ul> </nav> <div class="clearfix"></div> <yield></yield> </div> <div class="clearfix"></div>', 'th { white-space: nowrap } .selectbox { font-size: 150%; } .pagination { margin: 0px 0 10px 0 ; }', '', function(opts) {

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

		selectrow = (e) => {
			let value = e.item.row._id;
			let index = self.selection.indexOf(value);
			if (index !== -1) {
				self.selection.splice(index,1);
			} else{
				self.selection.push(value)
			}

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

