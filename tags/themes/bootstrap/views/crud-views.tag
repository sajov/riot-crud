<raw>
	<span></span>
	this.root.innerHTML = opts.content
</raw>

<crud-action-menu>

	<div class="btn-group">
		<a each={action in opts.actions} if={ action.active } onclick={ click } class="btn btn-{ action.buttonClass || 'default'} {dropdown-menu: action.options} btn-sm">{action.label}
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
	</style>

	<div>
		<div class="page-title">
	      <div class="title_left">
	        <h3>sdsad <small>sdadsas</small></h3>
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
	    <yield from="title"/>
		<div class="table-responsive">

			<table id={ opts.id } class="table table-striped jambo_table bulk_action">
			    <thead>
			      <tr >
			      	<th if={ opts.selection != false } nowrap>
						<input type="checkbox" id="check-all" class="flat">
					</th>
			        <!-- <th each="{ colkey, colval in data.data[0] }" onclick={ sort } >{ colkey }</th> -->
			        <th each="{ colkey, colval in thead }" onclick={ sort }>
			        	{ colkey }
			        	<small if={colval.type == 'string'} class="fa fa-sort-alpha-{ query.$sort[colkey] ? theadSort : 'asc'}"></small>
			        	<small if={colval.type == 'number'} class="fa fa-sort-numeric-{ query.$sort[colkey] ? theadSort : 'asc'}"></small>
			        	<small if={colval.type != 'number' && colval.type != 'string'} class="fa fa-sort-amount-{ query.$sort[colkey] ? theadSort : 'asc'}"></small>
			        </th>
			      </tr>
			    </thead>
			    <tbody>
			      <tr each="{ row in data.data }" >
			      	<td if={ opts.selection != false } class="a-center">
							<input  onclick={select} type="checkbox" class="flat" name="table_records">
					</td>
			        <!-- <td each="{ colkey, colval in row }" if={ thead[colkey] } onclick={ selectRow } >{ colval }</td> -->
			        <td each="{ colkey, colval in thead }" onclick={ selectRow } >{ row[colkey] }</td>
			      </tr>
			    </tbody>
		    </table>
		</div>
		<yield from="after"/>
	</div>

	<script>

		var self = this;
		self.opts.view = 'list';
		self.query = {
			$limit: opts.limit || 10,
            $skip: opts.skip || 0,
            $sort: {}
		};

		self.selection = [];

		this.mixin(FeatherClientMixin);

		self.on('mount', () => {
			console.info('tabel', self.service);
			if(self.opts.service) {
				self.initTable();
			}

		});

		triggerData (e) {
			console.log(e.target.getAttribute('data-trigger'))
			// RiotControl.trigger(e.)
		}



	    search (e) {
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
            self.initTable();
	    }

	    sort (e) {
	    	console.log(e.item);
	    	if(self.query.$sort[e.item.colkey]) {
            	self.query.$sort[e.item.colkey] = self.query.$sort[e.item.colkey] == 1 ? -1 : 1;
	    	} else {
	    		self.query.$sort = {};
            	self.query.$sort[e.item.colkey] = -1;
	    	}
	    	self.theadSort = self.query.$sort[e.item.colkey] == 1 ? 'asc' : 'desc';

            self.initTable();
	    }

	    select (e) {
	    	console.log(e.item);
	    }

	    selectRow (e) {
	    	console.log(e.item);
	    }

	    initSchema () {
	    	let schema = {};

	    	// if(opts.schema)
	    }

	    getRemoteSchema (url, cb) {

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

	    initTable () {

	    	self.getRemoteSchema(
				'http://localhost:3030/schema/product.json',
				self.getData
			);

	    }

	    getData () {

	    	console.log('self.query',self.query);
	        self.service.find({query:self.query}).then((result) => {
	             self.data = result;
	             console.info('Result', result);
	             console.info('Result', self.data.data[0]);
	             self.update();
	        }).catch((error) => {
	          console.error('Error', error);
	        });
	    }



	</script>
</crud-table>

