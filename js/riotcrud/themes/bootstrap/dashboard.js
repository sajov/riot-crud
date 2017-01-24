riot.tag2('top-widget', '<div class="tile-stats"> <div class="icon"><i class="fa {opts.icon}"></i></div> <div class="count">{opts.count}</div> <h3>{opts.title}</h3> <p> <a href="#{opts.service}/list" class="btn btn-xs pull-right"><i class="fa fa-list-ul"></i> show list</a> </p> </div>', '', '', function(opts) {
    var self = this;
    self.mixin(FeatherClientMixin);

    this.on('mount', () => {
        self.getData();
    });

    RiotControl.on('updateWidget'+opts.service, () => {
        self.getData();
    });

    self.getData = () => {
        if(typeof opts.service != 'undefined')
        self.client.service(opts.service)
                    .find({query:{$sort:{id:-1}}})
                    .then((result) => {
                            self.opts.count = result.total;
                            self.update();
                    })
                    .catch((error) => {iotControl.trigger(
                                'notification',
                                error.name + ' ' + error.type ,
                                'error',
                                error.message
                            );});
    }

});

riot.tag2('todo-list', '<div class="x_panel"> <div class="x_title"> <h2>{opts.title}<small>{opts.subtitle}</small></h2> <ul class="nav navbar-right panel_toolbox"> <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a> </li> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a> <ul class="dropdown-menu" role="menu"> <li><a href="#">Settings 1</a> </li> <li><a href="#">Settings 2</a> </li> </ul> </li> <li><a class="close-link"><i class="fa fa-close"></i></a> </li> </ul> <div class="clearfix"></div> </div> <div class="x_content"> <div class=""> <ul class="to_do"> <li each="{data in opts.todos}" if="{key!=\'default\'}"> <p><input type="checkbox" class="flat" __checked="{data.done}"> {data.todo} </p> </li> </ul> </div> </div> </div>', '', '', function(opts) {
        opts.todos = [
            {todo:'Routing (http://riotjs.com/api/route/)', done: true},
            {todo:'View Models (http://riotjs.com/)', done: true},
            {todo:'Feathers-Client https://docs.feathersjs.com/clients/readme.html', done: true},
            {todo:'add view Datatables (https://datatables.net/)', done: true},
            {todo:'add view Json Editor (https://github.com/jdorn/json-editor)', done: true},
            {todo:'add view JSON Form (https://github.com/joshfire/jsonform)', done: true},
            {todo:'Notifications ', done: true},
            {todo:'add view Steamtables', done: false},
            {todo:'Data upload/import', done: false},
            {todo:'add view ALPACA FORMS (http://www.alpacajs.org/)', done: false},
            {todo:'add view brutusin json-forms (json-forms https://github.com/brutusin/json-forms)', done: true},
            {todo:'add view X-editable (https://vitalets.github.io/x-editable/)', done: false},
        ];
});

riot.tag2('dashboard', '<div class="container-fluid"> <div class="block-header"> <h2>DASHBOARD</h2> </div> <div class="row clearfix"> <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12"> <div class="info-box bg-pink hover-expand-effect"> <div class="icon"> <i class="material-icons">playlist_add_check</i> </div> <div class="content"> <div class="text">NEW TASKS</div> <div class="number count-to" data-from="0" data-to="125" data-speed="15" data-fresh-interval="20"></div> </div> </div> </div> <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12"> <div class="info-box bg-cyan hover-expand-effect"> <div class="icon"> <i class="material-icons">help</i> </div> <div class="content"> <div class="text">NEW TICKETS</div> <div class="number count-to" data-from="0" data-to="257" data-speed="1000" data-fresh-interval="20"></div> </div> </div> </div> <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12"> <div class="info-box bg-light-green hover-expand-effect"> <div class="icon"> <i class="material-icons">forum</i> </div> <div class="content"> <div class="text">NEW COMMENTS</div> <div class="number count-to" data-from="0" data-to="243" data-speed="1000" data-fresh-interval="20"></div> </div> </div> </div> <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12"> <div class="info-box bg-orange hover-expand-effect"> <div class="icon"> <i class="material-icons">person_add</i> </div> <div class="content"> <div class="text">NEW VISITORS</div> <div class="number count-to" data-from="0" data-to="1225" data-speed="1000" data-fresh-interval="20"></div> </div> </div> </div> </div> <div class="row clearfix"> <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"> <div class="card"> <div class="header"> <h2>CPU USAGE (%)</h2> <div class="pull-right"> <div class="switch panel-switch-btn"> <span class="m-r-10 font-12">REAL TIME</span> <label>OFF<input type="checkbox" id="realtime" checked><span class="lever switch-col-cyan"></span>ON</label> </div> </div> <ul class="header-dropdown m-r--5"> <li class="dropdown"> <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_vert</i> </a> <ul class="dropdown-menu pull-right"> <li><a href="javascript:void(0);">Action</a></li> <li><a href="javascript:void(0);">Another action</a></li> <li><a href="javascript:void(0);">Something else here</a></li> </ul> </li> </ul> </div> <div class="body"> <div id="real_time_chart" class="dashboard-flot-chart"></div> </div> </div> </div> </div> <div class="row clearfix"> <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4"> <div class="card"> <div class="body bg-pink"> <div class="sparkline" data-type="line" data-spot-radius="4" data-highlight-spot-color="rgb(233, 30, 99)" data-highlight-line-color="#fff" data-min-spot-color="rgb(255,255,255)" data-max-spot-color="rgb(255,255,255)" data-spot-color="rgb(255,255,255)" data-offset="90" data-width="100%" data-height="92px" data-line-width="2" data-line-color="rgba(255,255,255,0.7)" data-fill-color="rgba(0, 188, 212, 0)"> 12,10,9,6,5,6,10,5,7,5,12,13,7,12,11 </div> <ul class="dashboard-stat-list"> <li> TODAY <span class="pull-right"><b>1 200</b> <small>USERS</small></span> </li> <li> YESTERDAY <span class="pull-right"><b>3 872</b> <small>USERS</small></span> </li> <li> LAST WEEK <span class="pull-right"><b>26 582</b> <small>USERS</small></span> </li> </ul> </div> </div> </div> <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4"> <div class="card"> <div class="body bg-cyan"> <div class="m-b--35 font-bold">LATEST SOCIAL TRENDS</div> <ul class="dashboard-stat-list"> <li> #socialtrends <span class="pull-right"> <i class="material-icons">trending_up</i> </span> </li> <li> #materialdesign <span class="pull-right"> <i class="material-icons">trending_up</i> </span> </li> <li>#adminbsb</li> <li>#freeadmintemplate</li> <li>#bootstraptemplate</li> <li> #freehtmltemplate <span class="pull-right"> <i class="material-icons">trending_up</i> </span> </li> </ul> </div> </div> </div> <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4"> <div class="card"> <div class="body bg-teal"> <div class="font-bold m-b--35">ANSWERED TICKETS</div> <ul class="dashboard-stat-list"> <li> TODAY <span class="pull-right"><b>12</b> <small>TICKETS</small></span> </li> <li> YESTERDAY <span class="pull-right"><b>15</b> <small>TICKETS</small></span> </li> <li> LAST WEEK <span class="pull-right"><b>90</b> <small>TICKETS</small></span> </li> <li> LAST MONTH <span class="pull-right"><b>342</b> <small>TICKETS</small></span> </li> <li> LAST YEAR <span class="pull-right"><b>4 225</b> <small>TICKETS</small></span> </li> <li> ALL <span class="pull-right"><b>8 752</b> <small>TICKETS</small></span> </li> </ul> </div> </div> </div> </div> <div class="row clearfix"> <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8"> <div class="card"> <div class="header"> <h2>TASK INFOS</h2> <ul class="header-dropdown m-r--5"> <li class="dropdown"> <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_vert</i> </a> <ul class="dropdown-menu pull-right"> <li><a href="javascript:void(0);">Action</a></li> <li><a href="javascript:void(0);">Another action</a></li> <li><a href="javascript:void(0);">Something else here</a></li> </ul> </li> </ul> </div> <div class="body"> <div class="table-responsive"> <table class="table table-hover dashboard-task-infos"> <thead> <tr> <th>#</th> <th>Task</th> <th>Status</th> <th>Manager</th> <th>Progress</th> </tr> </thead> <tbody> <tr> <td>1</td> <td>Task A</td> <td><span class="label bg-green">Doing</span></td> <td>John Doe</td> <td> <div class="progress"> <div class="progress-bar bg-green" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" style="width: 62%"></div> </div> </td> </tr> <tr> <td>2</td> <td>Task B</td> <td><span class="label bg-blue">To Do</span></td> <td>John Doe</td> <td> <div class="progress"> <div class="progress-bar bg-blue" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%"></div> </div> </td> </tr> <tr> <td>3</td> <td>Task C</td> <td><span class="label bg-light-blue">On Hold</span></td> <td>John Doe</td> <td> <div class="progress"> <div class="progress-bar bg-light-blue" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100" style="width: 72%"></div> </div> </td> </tr> <tr> <td>4</td> <td>Task D</td> <td><span class="label bg-orange">Wait Approvel</span></td> <td>John Doe</td> <td> <div class="progress"> <div class="progress-bar bg-orange" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%"></div> </div> </td> </tr> <tr> <td>5</td> <td>Task E</td> <td> <span class="label bg-cyan">Suspended</span> </td> <td>John Doe</td> <td> <div class="progress"> <div class="progress-bar bg-cyan" role="progressbar" aria-valuenow="87" aria-valuemin="0" aria-valuemax="100" style="width: 87%"></div> </div> </td> </tr> </tbody> </table> </div> </div> </div> </div> <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4"> <div class="card"> <div class="header"> <h2>BROWSER USAGE</h2> <ul class="header-dropdown m-r--5"> <li class="dropdown"> <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_vert</i> </a> <ul class="dropdown-menu pull-right"> <li><a href="javascript:void(0);">Action</a></li> <li><a href="javascript:void(0);">Another action</a></li> <li><a href="javascript:void(0);">Something else here</a></li> </ul> </li> </ul> </div> <div class="body"> <div id="donut_chart" class="dashboard-donut-chart"></div> </div> </div> </div> </div> </div> <link href="/bower_components/gentelella/vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/iCheck/skins/flat/green.css" rel="stylesheet"> <div class=""> <div class="row top_tiles"> <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12"> <top-widget title="Orders" description="Lorem ipsum psdea itgum rixt." icon="fa-euro" service="orders"></top-widget> </div> <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12"> <top-widget title="Categories" description="Lorem ipsum psdea itgum rixt." icon="fa-sitemap" service="categories"></top-widget> </div> <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12"> <top-widget title="Products" description="Lorem ipsum psdea itgum rixt." icon="fa-caret-square-o-right" service="products"></top-widget> </div> </div> <div class="row"> <div class="col-md-6 col-sm-6 col-xs-12"> <todo-list title="Feature List" subtitle="current and following tasks"></todo-list> <div id="jsoneditor-container"></div> </div> <div class="col-md-6 col-sm-6 col-xs-12"> <div id="json-forms-container"></div> </div> </div> <div class="row"> <div class="col-md-12 col-sm-12 col-xs-12"> </div> </div> </div>', '', '', function(opts) {
        var self = this;
        self.mixin(FeatherClientMixin);
alert(1)
        self.jsoneditorQuery = {
            id:1
        };

        self.dependencies = [
            riotCrudTheme + '/views/crud-jsoneditor.js',
            '/bower_components/gentelella/vendors/iCheck/icheck.min.js',
        ];

        this.refresh = (opts) => {
            initJsonForms();
            initJsonEditor();
        },

        this.on('mount', function() {
             RiotCrudController.loadDependencies(self.dependencies,'crud-jsoneditor', function (argument) {
                initPlugins();
                initJsonForms();
                initJsonEditor();
                setTimeout(this.fakeOrder, 3000);
                self.autoOrder = setInterval(this.fakeOrder, 8000);
            });
        });

        this.on('before-unmount', function() {
            clearTimeout(self.autoOrder);
        });

        initJsonEditor = () => {
            self.client.service('categories')
                .find({query:{$sort:{_id:-1},$limit:1}})
                .then((result) => {
                    riot.mount('#jsoneditor-container','crud-jsoneditor',
                         {
                            model: 'categories',
                            idField: '_id',
                            service: 'categories',
                            title: 'Categories',
                            description: 'inline category view with jsoneditor',
                            schema: 'http://localhost:3030/schema/category.json',
                            tag: 'crud-json-editor',
                            selection: true,
                            view: 'edit',
                            views: ['save'],
                            filterable: true,
                            menu:true,
                            actionMenu: true,
                            menuGroup: 'models',

                            title: 'Categories',
                            schema: 'http://localhost:3030/schema/category.json',
                            type:'inline',
                            query: {id:result.data[0]._id}
                    });
                })
                .catch((error) => {});
        }

        initJsonForms = () => {
            self.client.service('products')
                .find({query:{$sort:{_id:-1},$limit:1}})
                .then((result) => {
                        riot.mount('#json-forms-container','crud-json-forms',
                         {
                            model: 'products',
                            idField: '_id',
                            service: 'products',
                            title: 'Products',
                            description: 'inline products view with brutusin:json-forms',
                            schema: 'http://localhost:3030/schema/products.json',
                            tag: 'crud-json-editor',
                            selection: true,
                            view: 'edit',
                            views: ['save'],
                            filterable: true,
                            menu:true,
                            actionMenu: true,
                            menuGroup: 'models',

                            schema: 'http://localhost:3030/schema/category.json',
                            type:'inline',
                            query: {id:result.data[0]._id}
                    });
                })
                .catch((error) => {});
        }

        initPlugins = () => {

            $(document).ready(function() {
                if ($("input.flat")[0]) {
                    $('input.flat').iCheck({
                        checkboxClass: 'icheckbox_flat-green',
                        radioClass: 'iradio_flat-green'
                    });
                }
            });

        }

        fakeOrder = () => {
            self.client.service('orders')
                .find({query:{$sort:{id:-1},$limit:1}})
                .then((result) => {
                        var order = result.data[0];
                        order._id = (result.total + 100).toString();
                        self.client.service('orders')
                            .create(order)
                            .then((result) => {
                                RiotControl.trigger('updateWidgetorders');
                            })
                            .catch((error) => {RiotControl.trigger(
                                'notification',
                                error.name + ' ' + error.type ,
                                'error',
                                error.message
                            );
                        });
                })
                .catch((error) => {iotControl.trigger(
                        'notification',
                        error.name + ' ' + error.type ,
                        'error',
                        error.message
                    );
                });
        }

});


