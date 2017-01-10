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
            {todo:'Routing', done: true},
            {todo:'Feathers-Client with Socketio', done: true},
            {todo:'add Feathers-Client with Socketio', done: true},
            {todo:'Notifications', done: true},
            {todo:'add view Datatables', done: true},
            {todo:'add view Json Editor', done: true},
            {todo:'add view Steamtables', done: false},
            {todo:'add view jsonform', done: true},
            {todo:'Data upload/import', done: false},
            {todo:'add view ALPACA FORMS', done: false},
            {todo:'add view brutusin json-forms', done: false},
        ];
});

riot.tag2('dashboard', '<link href="/bower_components/gentelella/vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/iCheck/skins/flat/green.css" rel="stylesheet"> <div class=""> <div class="row top_tiles"> <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12"> <top-widget title="Orders" description="Lorem ipsum psdea itgum rixt." icon="fa-euro" service="orders"></top-widget> </div> <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12"> <top-widget title="Categories" description="Lorem ipsum psdea itgum rixt." icon="fa-sitemap" service="categories"></top-widget> </div> <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12"> <top-widget title="Products" description="Lorem ipsum psdea itgum rixt." icon="fa-caret-square-o-right" service="products"></top-widget> </div> </div> <div class="row"> <div class="col-md-6 col-sm-6 col-xs-12"> <todo-list title="Feature List" subtitle="current and following tasks"></todo-list> </div> <div class="col-md-6 col-sm-6 col-xs-12"> <div id="jsoneditor"></div> <crud-jsoneditorno title="Products" subtitle="(jsoneditor view demo)" query="{jsoneditorQuery}" servicname="categories" view="edit" type="inline"></crud-jsoneditorNO> </div> </div> </div>', '', '', function(opts) {
        var self = this;
        self.mixin(FeatherClientMixin);

        self.jsoneditorQuery = {

            id:1
        };

        self.dependencies = [
            riotCrudTheme + '/views/crud-jsoneditor.js',
            '/bower_components/gentelella/vendors/iCheck/icheck.min.js',
        ];

        this.on('mount', function() {
             RiotCrudController.loadDependencies(self.dependencies,'crud-jsoneditor', function (argument) {
                initPlugins();
                riot.mount('#jsoneditor','crud-jsoneditor',
                     {
                        model: 'categories',
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
                        menuGroup: 'models',
                        buttons: ['edit','delete'],
                        title: 'Categories',
                        schema: 'http://localhost:3030/schema/category.json',
                        type:'inline',
                        query: {id:'1'}
                });
                setTimeout(this.fakeOrder, 3000);
                self.autoOrder = setInterval(this.fakeOrder, 8000);
            });
        });

        this.on('before-unmount', function() {
            clearTimeout(self.autoOrder);
        });

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
                        order.id = result.total + 100;
                        order._id = result.total + 100;
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


