<raw>
	<span></span>
	this.root.innerHTML = opts.content
</raw>

<crud-action-menu>

	<div class="btn-group">
		<a each={action in opts.actions} if={ action.active} onclick={ click } class="btn btn-{ action.buttonClass || 'default'} {dropdown-menu: action.options} btn-sm">{action.label}
			<!-- <i class="fa fa-save"></i> -->
		</a>

 <!--        <a data-toggle="dropdown" class="btn btn-default btn-sm dropdown-toggle" type="a" aria-expanded="false">
						Actions <span class="caret"></span>
				 </a>
				<ul role="menu" class="dropdown-menu">
					<li each={option in ['Copy','CSV','Excel','Print','divider','Import']} class="{divider: option == 'divider'}"><a if={option != 'divider'} href="#">{option}</a></li>
				</ul> -->
			</div>
			<script>
				var self = this;
				this.mixin(viewActionsMixin);
			</script>


</crud-action-menu>


<crud-table>

	<style type="text/css">
		th {
			white-space: nowrap
		}
		.selectbox {
			font-size: 150%;
		}

		.pagination {
			margin: 0px 0 10px 0 ;
		}
	</style>

	<div>
		 <div class="page-title">
          <div class="title_left">
            <h3>{title} <small>{description}</small></h3>
          </div>

          <div class="title_right">
            <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search">
              <div class="input-group">
                <input type="text" class="form-control" onkeyup={ search } placeholder="Search for...">
                <span class="input-group-btn">
                  <button class="btn btn-default" type="button">Go!</button>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>

	    <!-- <yield from="title"/> -->
	    <!-- <yield from="buttons"/> -->

		<div class="table-responsive">

			<table id={ opts.id } class="table table-striped jambo_table bulk_action">

			    <thead>
			      <tr >
			      	<th if={ opts.selection != false } nowrap>
			      		<i onclick={ selectall } data-value="{ selection.length ==  data.data.length ? 1 : 0 }" class="fa fa-{'check-': selection.length ==  data.data.length}square selectbox"></i>
					</th>
			        <!-- <th each="{ colkey, colval in data.data[0] }" onclick={ sort } >{ colkey }</th> -->
			        <th each="{ colkey, colval in thead }" onclick={ sort }>
			        	{ colkey }
			        	<small if={colval.type == 'string'} class="fa fa-sort-alpha-{ query.$sort[colkey] ? theadSort : 'asc'}"></small>
			        	<small if={colval.type == 'number'} class="fa fa-sort-numeric-{ query.$sort[colkey] ? theadSort : 'asc'}"></small>
			        	<small if={colval.type != 'number' && colval.type != 'string'} class="fa fa-sort-amount-{ query.$sort[colkey] ? theadSort : 'asc'}"></small>
			        </th>
			        <th>
			        	<i onclick={ toggleFilter } class="fa fa-filter"></i>
			        </th>
			      </tr>
			    </thead>

			    <tbody>
			    	<tr class="{'hide': !showFilter}">
				      	<td if={ opts.selection != false } nowrap>&nbsp;</td>
				        <td each="{ colkey, colval in thead }" onclick={ sort }>
				        	<input type="text" name="{ colkey }" placeholder="enter serach">
				        </td>
				        <td>&nbsp;</td>
			      	</tr>

			      	<tr each="{ row in data.data }"  onclick={ selectrow } class="{ 'selected': selection.indexOf(row._id) != -1 }">
				      	<td if={ opts.selection != false } class="a-center">
				      			<i data-value="{ row._id }" class="fa fa-{'check-': selection.indexOf(row._id) != -1 }square selectbox"></i>
						</td>
				        <td each="{ colkey, colval in thead }" onclick={ selectRow } >
				        	{ row[colkey] }
				        </td>
				      	<td>&nbsp;</td>
				    </tr>
			    </tbody>
		    </table>
		</div>
		<div class="clearfix"></div>

		<nav aria-label="Page navigation" class="pull-right">
		  <ul class="pagination">
		    <li each={page in pagination}>
		    	<a href="#" onclick={paginate} class={'disabled':page.active == false}>
		        	<i class="{page.class}"></i>{page.label}
		      	</a>
		    </li>
		  </ul>
		</nav>
		<div class="clearfix"></div>

		<!-- <yield from="buttons"/> -->
		<yield></yield>
	</div>
	<div class="clearfix"></div>

	<script>

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
             /* search */
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
			// self.update();
		}

		selectrow = (e) => {
			let value = e.item.row._id;
			let index = self.selection.indexOf(value);
			if (index !== -1) {
				self.selection.splice(index,1);
			} else{
				self.selection.push(value)
			}
			// self.update();
		}

	    initSchema = () => {
	    	let schema = {};

	    	// if(opts.schema)
	    }

	    getRemoteSchema = (url, cb) => {

	    	var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.onload = function() {

			  if (request.status >= 200 && request.status < 400) {

			    self.schema = JSON.parse(request.responseText);

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

			    console.info('getRemoteSchema', self.schema,self.thead);
			  } else {
			    console.error('getRemoteSchema');
			  }
			  cb();
			};

			request.onerror = function() {
			  // There was a connection error of some sort
			  cb();
			};

			request.send();
	    }

	    initTable = () => {
	    	getRemoteSchema(
				'http://localhost:3030/schema/product.json',
				getData
			);
	    }

	    initPagination = () => {
	    	self.pagination = [];
	    	self.pagecount = 5;
    		self.pagination.push({label:'', class:'fa fa-angle-double-left',active: self.data.skip == 0,skip:0})

    		let start = 1;
    		let end = (Math.ceil(self.data.total/self.data.limit))-1;

    		if(self.data.skip > 0){
    			start = Math.ceil(self.data.skip/self.data.limit);
    		}

		    console.info('RANGE start-end',start+ ' - ' + end + ' ??? ' + start+self.pagecount + ' > ' + end);
    		if((start+self.pagecount) > (end-1)) {
		    console.warn('RANGE start-end',start+ ' - ' + end);
    			start = end-4;
    		}
	    	let range = Array.apply(start, Array(self.pagecount))
		        .map(function (element, index) {
		        	// return {label:index,skip:index*self.data.limit}
		          return index + start;
		    });

		    for (var i = 0; i < range.length; i++) {
	    			self.pagination.push({label:range[i],skip:range[i]*self.data.limit})
		    }
console.error({label:'', class:'fa fa-angle-double-right', active: (self.data.skip * self.data.skip == 0), skip: end})
    		self.pagination.push({label:'', class:'fa fa-angle-double-right', active: (self.data.skip * self.data.skip == 0), skip: end*self.data.limit})

		    console.warn('RANGE',range,self.pagination);
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
	</script>
</crud-table>

