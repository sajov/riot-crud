
<panel>
    <yield />
    <button each={color in colors} onclick={ click }>Call {color}</button>
    <div show={called}>I hear you {caller}
    </div>
    <style>
      panel_a{
          display:block;
          width:400px;
          height:80px;
          background:red;
          border:solid;
          margin-bottom:20px;
          padding:5px;
      }

      panel_b{
          display:block;
          width:400px;
          height:80px;
          background:lightblue;
          border:solid;
           padding:5px;
      }

      panel_c{
          display:block;
          width:140px;
          height:50px;
          background:yellow;
          border:solid;
          float:right;
          margin:5px;
           padding:5px;
      }
    </style>
    <script>
      this.color = opts.color
      this.mixin(SharedMixin)
    </script>
</panel>

<crud-action-menu>

    <panel_a riot-tag="panel" color='red'></panel_a>
    <panel_b riot-tag="panel" color='blue'>
        <panel_c riot-tag="panel" color='yellow'></panel_c>
    </panel_b>


    <div class="btn-group">
        <a if="{opts.actions.edit}"  service="{opts.service}" view="{opts.view}" id="{opts.id}" class="btn btn-primary btn-sm" href="#" onclick={ actionMenuTrigger } >Edit</a>
        <a if="{opts.actions.view}"  service="{opts.service}" view="{opts.view}" id="{opts.id}" class="btn btn-info btn-sm" href="#" onclick={ actionMenuTrigger } >View</a>
        <a if="{opts.actions.save}"  service="{opts.service}" view="{opts.view}" id="{opts.id}" class="btn btn-success btn-sm" href="#" onclick={ actionMenuTrigger } >Save</a>
        <a if="{opts.actions.delete}"  service="{opts.service}" view="{opts.view}" id="{opts.id}" class="btn btn-danger btn-sm" href="#" onclick={ actionMenuTrigger } >Delete</a>
        <a if="{opts.actions.create}"  service="{opts.service}" view="{opts.view}" id="{opts.id}" class="btn btn-warning btn-sm" href="#" onclick={ actionMenuTrigger } >New</a>
        <a if="{opts.actions.list}"  service="{opts.service}" view="{opts.view}" id="{opts.id}" class="btn btn-default btn-sm" href="#" onclick={ actionMenuTrigger } >List</a>
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
    </div>


    <script>
      var self = this;
      self.mixin(serviceMixin);
      self.mixin(serviceObservableMixin);


      opts.actions = {
        edit: true,
        view: true,
        create: true,
        list: true,
        delete: true,
        save: true

      };

      this.on('update', () => {

        for(var i = 0; i < opts.views.length; i++){
            opts.actions[opts.views[i]] = true;
        }

        if(opts.view != 'view') {
          opts.actions.edit = false;
        }

        if(opts.view == 'create') {
          opts.actions.delete = false;
        }

        if(opts.view == 'view') {
          opts.actions.save = false;
        }
        if(opts.view == 'edit') {
          opts.actions.save = true;
        }

        if(opts.view != 'view') {
          opts.actions.create = false;
        }

        if(opts.view == 'view' || opts.view == 'create') {
          opts.actions.view = false;
        }

        console.info('CRUD-ACTION-MENU UPDATE',opts.name,opts.view,  opts.views, opts.data, opts.actions);
      });

      this.save = (e) => {
        if(opts.view == 'create') {
          parent.create();
        } else if(opts.view == 'edit') {
          parent.save();
        }
      }
    </script>

</crud-action-menu>

<crud-top-bar>
    <div class="top-bar">
        <div class="top-bar-title">
        <!--   <span data-responsive-toggle="responsive-menu" data-hide-for="medium">
            <span class="menu-icon dark" data-toggle></span>
          </span> -->
          <span>{ VM.config.title } {VM.data.id}</span>
          <br /><small class="subheader">{ VM.config.description }</small>
        </div>

        <div if={ VM.search } id="responsive-menu">
          <div class="top-bar-right">
            <ul class="menu">
              <li><input type="search" onkeyup="{VM.search}" class="small" style="font-size: 14px;" placeholder="Search"></li>
              <li><button type="button" onclick="{VM.search}" data-submit class="button small"><span class="fi-magnifying-glass"></span></button></li>
            </ul>
          </div>
        </div>

        <div class="top-bar-right">
            <ul class="dropdown menu" data-dropdown-menu>
               <li if={ VM.selectedIds.length != 0 } >
                   <a href="#" onclick="{VM.delete}" class="button small alert fi-trash"> Delete ({ VM.selectedIds.length })</a>
              </li>
              <li if={ VM.selectedIds.length != 0 } >
                   <a href="{VM.csvData}" onclick="{VM.delete}" download="{VM.model}.csv" class="button small secondary fi-save"> CSV ({ VM.selectedIds.length })</a>
              </li>
              <li if={ VM.config.menu.list }>
                <a href="#" onClick="{VM.list}" class="button small secondary fi-list-bullet"> List</a>
              </li>
              <li if={ VM.config.menu.show }>
                <a href="#" onClick="{VM.show}" class="button small warning fi-page-search"> Show</a>
              </li>
              <li if={ VM.config.menu.edit }>
                <a href="#" onclick="{VM.edit}" class="button small warning fi-page-edit"> Edit</a>
              </li>
              <li if={ VM.config.menu.save } >
                <a href="#" onclick="{VM.save}" class="button small success fi-save"> Save</a>
              </li>
              <li if={ VM.config.menu.creation } >
                <a href="#" onclick="{VM.creation}" class="button small success fi-edit"> Create</a>
              </li>
              <li if={ VM.config.menu.destroy } >
                <a href="#" onclick="{VM.destroyModal}" class="button small alert fi-trash"> Delete</a>
              </li>
              <li if={ VM.search } >
                <a if={ opts.delete } class="button small secondary fi-magnifying-glass"> Search</a>
              </li>
            </ul>
        </div>
    </div>
</crud-top-bar>

<crud-pagination>
    <div class="row">
      <div class="small-4 large-4 columns text-right">
        <div class="button-group small">
            <a onclick={ VM.gotoPage } class="button {disabled: opts.page==1}" data-page="1" >«</a>
            <a onclick={ VM.gotoPage } class="button {disabled: opts.page==1}" data-page="{opts.page-1}">‹</a>
        </div>
      </div>
      <div class="small-4 large-4 columns text-center">
        <div class="button-group small">
            <virtual each={ p in opts.pages }>
                  <a onclick={ VM.gotoPage } class="button {secondary: p==parent.opts.page}">{p}</a>
            </virtual>
        </div>
      </div>
      <div class="small-4 large-4 columns text-left">
        <div class="button-group small">
            <a onclick={ VM.gotoPage } class="button {disabled: opts.total==opts.page}" data-page="{opts.page+1}">›</a>
            <a onclick={ VM.gotoPage } class="button {disabled: opts.total==opts.page}" data-page="{opts.total}" >»</a>
        </div>
      </div>
    </div>
</crud-pagination>


<crud-tree>
    <ul each={ nodes }>
      <li>
        <div class="treenode{ selected ? ' selected' : '' }" onclick={ clicked } title={ title }>
            <span class="icon { children.length ? expanded ? css.open  : css.closed : css.leaf }"> </span>
            <span class={ children.length ? '' : 'leaf' }>{ label }</span>
        </div>
        <crud-tree nodes={ children } handler={ parent.handler } css={ parent.css } show={ expanded }></crud-tree>
      </li>
    </ul>

    <style scoped>
      ul {list-style: none; padding-left: 0.6em;margin: 0.25em 0;}
      li {cursor: pointer;margin-top:0.3em;}
      .icon {width: 1.1em; }
    </style>

    <script>
      //http://richardbondi.net/riot/
      var self = this;
      this.title = opts.title
      this.css = opts.css  || {open: 'fa fa-caret-down', closed: 'fa fa-caret-right' , leaf: 'fa fa-genderless'}
      this.nodes = opts.nodes || [];
      this.nodes.map(function(n) {n.children = n.children || []; n.selected = false})

      clicked(e) {
        e.item.expanded = !e.item.expanded
        self.handler(e.item)
      }

      this.handler = opts.handler || function(node) {
        if(!self.node) self.node = {}
        self.node.selected = false
        node.selected = true
        self.node = node
        self.update()
        self.trigger('nodeclick', node)
      }
    </script>
</crud-tree>

<crud-modal-destroy>
    <div class="reveal" id="destroyModal" data-id="{opts.id}" data-reveal data-close-on-click="true" data-animation-in="spin-in" data-animation-out="spin-out">
        <h1>Delete #{opts.id} !</h1>
        <p class="lead">Do you realy want to delete "{opts.name}" ?</p>
        <a class="button alert" id="{opts.id}" data-id="{opts.id}" onclick="{VM.destroy}">Delete</a>
        <a class="button secondary" data-close>Abort</a>
        <button class="close-button" data-close aria-label="Close reveal"  type="button">
          <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <script>
        this.state = false;
        this.on('updated', function(){
            // console.log('this.state',this.state);
            this.state = true;
            // console.log('tag modal updated');
            // console.log(this.opts);
            // console.log('tag modal this.opts',typeof this.opts.id);
            if(typeof this.opts.id !== 'undefined' && this.state) {
              // $('#destroyModal').foundation('open');
              this.state = false;
            } else {
                // $('#destroyModal').foundation('close');
            }
        });

    </script>
</crud-modal-destroy>

<crud-modal-added>
    <div class="reveal" id="addedModal" data-id="{opts.id}" data-reveal data-close-on-click="true" data-animation-in="spin-in" data-animation-out="spin-out">
        <h1>Delete #{opts.id} !</h1>
        <p class="lead">Do you realy want to delete "{opts.name}" ?</p>
        <a class="button alert" onclick="{VM.added}">Delete</a>
        <a class="button secondary" data-close>Abort</a>
        <button class="close-button" data-close aria-label="Close reveal"  type="button">
          <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <script>
        this.on('updated', function(){
            console.log('modal updated');
            console.log(this.opts);
            // if(typeof this.opts.id !== 'undefined')
              // $('#addedModal').foundation('open');
        });

    </script>
</crud-modal-added>

<crud-field-switch>
  <div class="switch small">
    <input class="switch-input" id="{opts.field}" type="checkbox" checked="{opts.data}" name="{opts.field}">
    <label class="switch-paddle" for="{opts.field}">
      <span class="switch-active" aria-hidden="true">Yes</span>
      <span class="switch-inactive" aria-hidden="true">No</span>
    </label>
  </div>
  <script>

  </script>
</crud-field-switch>


<raw>
    <span></span>
    <script>
        var tag = this;
        tag.on('mount', function(){
            if(opts.content) {
              this.root.innerHTML = opts.content;
              return;
            }

            if(!opts.data)
                return;

            if(opts.field.tag) {
                riot.mount(this.root, opts.field.tag, opts.data);
            } else if(typeof opts.field.fn === 'function') {
                this.root.innerHTML = opts.field.fn(opts.field, opts.data);
            } else {
                this.root.innerHTML = opts.data[opts.field.name];
            }
        })
        tag.on('update', function(){
            if(opts.content) {
              this.root.innerHTML = opts.content;
              return;
            }

            if(!opts.data)
                return;

            if(opts.field.tag) {
                riot.mount(this.root, opts.field.tag, opts.data);
            } else if(typeof opts.field.fn === 'function') {
                this.root.innerHTML = opts.field.fn(opts.field, opts.data);
            } else {
                this.root.innerHTML = opts.data[opts.field.name];
            }
        })
    </script>
</raw>

<raw-td>
    <span></span>
    <script>
        var tag = this;
        tag.on('mount', function(){
            if(!opts.data || opts.field.isDetailLink)
                return;

            if(opts.field.tag) {
                riot.mount(this.root, opts.field.tag, opts.data);
            } else if(typeof opts.field.fn === 'function') {
                this.root.innerHTML = opts.field.fn(opts.field, opts.data);
            } else {
                this.root.innerHTML = opts.data[opts.field.name];
            }
        })

    </script>
</raw-td>
<!-- riot crud views -->
<crud-view-show>
    <div class="container">

        <crud-top-bar></crud-top-bar>

        <form id="{VM.model}-show">

            <virtual each="{field in VM.config.fields}">

                <div class="row small-up-2 medium-up-3 large-up-4">

                    <div class="small-3 columns">
                        <label for="{ field.name }" class="text-right middle">{ field.title }</label>
                    </div>

                    <div class="small-9 columns">

                        <strong if="{!field.fn}">{ VM.row[field.name] }</strong>

                        <crud-field-switch if="{field.type=='switch'}" field="{ field }" data="{ VM.row[field.name] }"></crud-field-switch>

                        <virtual if="{field.fn!=false}">
                                <raw field="{ field }" data="{ VM.row }"/>
                        </virtual>

                    </div>
                </div>

            </virtual>

        </form>

    </div>
    <crud-modal-destroy data="{VM.row}"></crud-modal-destroy>
</crud-view-show>

<crud-view-edit>
    <div class="container">

        <crud-top-bar></crud-top-bar>

        <form id="{VM.model}-edit">

            <virtual each="{field in VM.config.fields}">

                <div class="row small-up-2 medium-up-3 large-up-4">
                    <div class="small-3 columns">
                        <label for="{ field.name }" class="text-right middle">{ field.title }</label>
                    </div>

                    <div class="small-up-9 large-up-6 columns">
                        <input if="{field.type=='text'||field.type=='number'}" type="{field.type}" id="{ field.name }" name="{ field.name }" value="{ VM.row[field.name] }" placeholder="{ field.title }" {console.log('dude')}>

                        <input if="{field.type=='checkbox'}" type="checkbox" id="{ field.name }" name="{ field.name }" { checked: VM.row[field.name]} placeholder="{ field.title }">

                        <input if="{field.type=='date'}" type="date" id="{ field.name }" name="{ field.name }" value="{ new Date(VM.data[field.name]).toISOString().split('T')[0] }" placeholder="{ field.title }">

                        <textarea if="{field.type=='textarea'}" id="{ field.name }" name="{ field.name }" placeholder="{ field.title }">{ VM.row[field.name] }</textarea>

                        <crud-field-switch if="{field.type=='switch'}" field="{ field }" data="{ VM.row[field.name] }"></crud-field-switch>

                        <select if="{field.type=='select'}">
                            <option value="husker">Husker</option>
                            <option value="starbuck">Starbuck</option>
                            <option value="hotdog">Hot Dog</option>
                            <option value="apollo">Apollo</option>
                        </select>
                    </div>
                </div>

            </virtual>

        </form>

        <crud-modal-destroy></crud-modal-destroy>
    </div>
</crud-view-edit>

<crud-view-creation>
    <div class="container">

        <crud-top-bar></crud-top-bar>

        <form id="{VM.model}-edit">

            <virtual each="{field in VM.config.fields}">

                <div class="row small-up-2 medium-up-3 large-up-4">
                    <div class="small-3 columns">
                        <label for="{ field.name }" class="text-right middle">{ field.title }</label>
                    </div>

                    <div class="small-up-9 large-up-6 columns">
                        <input if="{field.type=='text'||field.type=='number'}" type="{field.type}" id="{ field.name }" name="{ field.name }" placeholder="{ field.title }" {console.log('dude')}>

                        <input if="{field.type=='checkbox'}" type="checkbox" id="{ field.name }" name="{ field.name }" { checked: VM.row[field.name]} placeholder="{ field.title }">

                        <input if="{field.type=='date'}" type="date" id="{ field.name }" name="{ field.name }"  placeholder="{ field.title }">

                        <textarea if="{field.type=='textarea'}" id="{ field.name }" name="{ field.name }" placeholder="{ field.title }">{ VM.row[field.name] }</textarea>

                        <crud-field-switch if="{field.type=='switch'}" field="{ field.name }" data="{ VM.row[field.name] }"></crud-field-switch>

                    </div>
                </div>

            </virtual>

        </form>

        <crud-modal-destroy></crud-modal-destroy>
        <crud-modal-added></crud-modal-added>
    </div>
</crud-view-creation>

<crud-view-list>
    <div class="container">

        <crud-top-bar></crud-top-bar>
        <div class="table-scrollNO">
            <table class="hover stackNO">
                <thead>
                    <tr if="{!VM.toggleFilter}">
                        <th width="30"><input onclick="{VM.selectAll}" type="checkbox"/></th>
                        <th  each="{ field in VM.config.fields }" width="{field.attr.width}">
                          <span if="{!VM.toggleFilter}">{ field.title }</span>
                          <span  onclick="{VM.sort}" class="subheader"><i class="{ field.sortDir || 'fi-arrow-down'}"></i></span>
                        </th>
                        <th>
                            <a class="tiny primary button fi-filter" onclick="{VM.showFilter}" href="#"></a>
                        </th>
                    </tr>
                    <tr if="{ VM.toggleFilter }">
                        <th><input onclick="{VM.selectAll}" type="checkbox"/></th>
                        <th each="{ field in VM.config.fields }" onkeyup="{VM.filter}" width="{field.attr.width}">
                          <input type="search" if="{ field.filter }" placeholder="{ field.title }" class="small" style="width:80%;height:34px;margin:0;display:inherit">
                          <span  onclick="{VM.sort}" class="subheader"><i class="{ field.sortDir || 'fi-arrow-down'}"></i></span>
                        </th>
                        <th width="80">
                            <a class="tiny primary button fi-filter" onclick="{VM.showFilter}" href="#"></a>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr each="{row in VM.rows}">

                        <td><input onclick="{VM.select}"  type="checkbox" checked="{ VM.selected }" /></td>

                        <td  each="{ field in VM.config.fields }">
                            <!-- {row[field.name]} -->

                            <!-- TESTING -->
                            <raw-td field="{ field }" data="{ parent.row }"/>

                            <a if="{field.isDetailLink}" onclick="{VM.show}" id="{row.id}" href="#">{row[field.name]}</a>
                            <!-- OLD STYLE -->
                            <!-- <virtual if="{!field.template && !field.isDetailLink && !field.tag}">{row[field.name]}</virtual>


                            <crud-field-switch if="{field.type=='switch'}" field="{ field }" data="{ parent.row }"></crud-field-switch>

                            <virtual if="{field.template!=false}">
                                <raw field="{ field }" data="{ parent.row }"/>
                            </virtual> -->

                        </td>

                        <td>
                            <div class="tiny  button-group">
                                <a class="success button fi-page-search" id="{row.id}" onclick="{VM.show}" href="#"></a>
                                <a class="alert button fi-trash" id="{row.id}" onclick="{VM.destroyModal}" href="#"></a>
                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>

        <crud-pagination page="{VM.pagesCurrent}" total="{VM.pagesTotal}" pages="{VM.pages}"></crud-pagination>
        <crud-modal-destroy></crud-modal-destroy>

    </div>

</crud-view-list>

