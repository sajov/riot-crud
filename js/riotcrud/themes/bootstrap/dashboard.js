
riot.tag2('top-widget', '<div onclick="{routeTo}" class="info-box hover-expand-effect"> <div class="icon {opts.bgcolor}"> <i if="{opts.icon}" class="material-icons col-{color}">{opts.icon}</i> <div id="pie-{opts.service}" if="{opts.pie}" class="pie {opts.pie}">{opts.sparklinedata}</div> </div> <div class="content"> <div class="text">{opts.title}</div> <div class="number count-to" data-from="0" data-to="{opts.count}" data-speed="1000" data-fresh-interval="20">{opts.count}</div> </div> </div>', '', '', function(opts) {
        var self = this;
        self.mixin('FeatherClientMixin');
        self.color = $('body').attr('class').replace('theme-','');

        $('.right-sidebar .demo-choose-skin li').on('click', function () {
            self.color = $('body').attr('class').replace('theme-','');
            self.update();
        });

        this.on('mount', () => {
            self.getData();
        });

        this.on('updated', () => {
            self.initPlugins();
        });

        RiotControl.on('updateWidget'+opts.service, () => {
            self.getData();
        });

        self.getData = () => {
            if(typeof opts.service != 'undefined')
            self.client.service(opts.service)
                .find({query:{$sort:{orderId:-1,id:-1}}})
                .then((result) => {
                        self.opts.count = result.total;
                        if(opts.datafield) {
                            opts.sparklinedata = [];
                            for (var i = 0; i < result.data.length; i++) {
                                opts.sparklinedata.push(parseInt(result.data[i].total))
                            }
                        }
                        self.update();

                })
                .catch((error) => {RiotControl.trigger(
                            'notification',
                            error.name + ' ' + error.type ,
                            'error',
                            error.message
                        );});
        }

        self.on('updated', () => {
            if(self.opts.count) {

            }
        });

        self.initPlugins = () => {
            initCounters();
            initCharts();

            function initCounters() {

            }

            function initCharts() {
                var chartColor =    $.AdminBSB.options.colors[self.color] || $.AdminBSB.options.colors[opts.color] || 'white';
                $('#pie-'+opts.service).sparkline(opts.sparklinedata, {
                    type: opts.sparkline ||  'bar',
                    barColor: chartColor,
                    negBarColor: chartColor,
                    barWidth: '8px',
                    height: '34px'
                });
            }
        }

        self.routeTo = (e) => {
            e.preventDefault();

            route(opts.service + '/list');
        }
});

riot.tag2('todo-list', '<div class="card"> <div class="header"> <h2>{opts.title}<small>{opts.subtitle}</small></h2> <ul class="header-dropdown m-r--5"> <li class="dropdown"> <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_vert</i> </a> <ul class="dropdown-menu pull-right"> <li><a href="javascript:void(0);">Action</a></li> <li><a href="javascript:void(0);">Another action</a></li> <li><a href="javascript:void(0);">Something else here</a></li> </ul> </li> </ul> </div> <div class="body"> <div each="{data,key in opts.todos}" if="{key!=\'default\'}"> <input type="checkbox" id="basic_checkbox_{key}" class="filled-in" __checked="{data.done}"><label for="basic_checkbox_{key}">{data.todo}</label> </div> </div> </div>', '', '', function(opts) {
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

riot.tag2('dashboard', '<div class="row top_tiles"> <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12"> <top-widget title="Orders" description="" pie="chart chart-pie" sortdir="-1" sortfield="orderId" datafield="total" service="orders"></top-widget> </div> <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12"> <top-widget title="Categories" description="" sparkline="line" sparklinedata="30,35,25,8" color="cyan" icon="list" service="categories"></top-widget> </div> <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12"> <top-widget title="Products" description="" icon="shopping_cart" color="cyan" service="products"></top-widget> </div> </div> <div class="row"> <div class="col-md-6 col-sm-6 col-xs-12"> <crud-table ref="ordertable" title="Orders List" description="riot-crud Table" service="orders" showheader="true" limit="4" fields="_id,orderId,total,name,createdAt" sortfield="orderId" sortdir="-1" showpagination="1" changelimit="1" skip="0" ups="{table:\'test\'}"> </crud-table> </div> <div class="col-md-6 col-sm-6 col-xs-12"> <div id="json-forms-orders"></div> </div> </div> <div class="row"> <div class="col-md-6 col-sm-6 col-xs-12"> <div id="jsoneditor-categories"></div> </div> <div class="col-md-6 col-sm-6 col-xs-12"> <div id="json-forms-products"></div> </div> </div> <div class="row"> <div class="col-xs-12"> <todo-list title="Feature List" subtitle="current and following tasks"></todo-list> </div> </div>', '', '', function(opts) {
        var self = this;
        self.mixin('FeatherClientMixin');
        self.jsoneditorQuery = {
            id:1
        };

        self.dependencies = [
            riotCrudTheme + '/views/crud-jsoneditor.js',
            '/bower_components/gentelella/vendors/iCheck/icheck.min.js',
        ];

        this.refresh = (opts) => {
            initJsonFormsOrders();
            initJsonFormsProducts();
            initJsonEditorCategories();
        },

        this.initView = () => {

        },

        this.on('mount', function() {
             RiotCrudController.loadDependencies(self.dependencies,'crud-jsoneditor', function (argument) {
                initPlugins();
                initJsonFormsOrders();
                initJsonFormsProducts();
                initJsonEditorCategories();

            });
        });

        this.on('before-unmount', function() {
            clearTimeout(self.autoOrder);
        });

        initJsonEditorCategories = () => {
            self.client.service('categories')
                .find({query:{$sort:{_id:-1},$limit:1}})
                .then((result) => {
                    riot.mount('#jsoneditor-categories','crud-jsoneditor',
                         {
                            model: 'categories',
                            idfield: '_id',
                            service: 'categories',
                            title: 'Categories',
                            description: 'inline category view with jsoneditor',
                            schema: 'http://' + window.location.hostname+ ':3030/schema/category.json',
                            tag: 'crud-json-editor',
                            selection: true,
                            view: 'edit',
                            views: ['save'],
                            filterable: true,
                            menu:true,
                            actionMenu: true,
                            menuGroup: 'models',

                            title: 'Categories',
                            schema: 'http://' + window.location.hostname+ ':3030/schema/category.json',
                            type:'inline',
                            query: {id:result.data[0]._id}
                    });
                })
                .catch((error) => {});
        }

        initJsonFormsProducts = () => {
            self.client.service('products')
                .find({query:{$sort:{_id:-1},$limit:1}})
                .then((result) => {

                        riot.mount('#json-forms-products','crud-json-forms',
                         {
                            model: 'products',
                            idfield: '_id',
                            service: 'products',
                            title: 'Products',
                            description: 'inline products view with brutusin:json-forms',
                            schema: true,

                            tag: 'crud-json-forms',
                            selection: true,
                            view: 'edit',
                            views: ['save'],
                            filterable: true,
                            menu:true,
                            actionMenu: true,
                            menuGroup: 'models',

                            type:'inline',
                            query: {id:result.data[0]._id}
                    });
                })
                .catch((error) => {});
        }

        initJsonFormsOrders = () => {
            self.client.service('orders')
                .find({query:{$sort:{_id:-1},$limit:1}})
                .then((result) => {
                        riot.mount('#json-forms-orders','crud-json-forms',
                         {
                            model: 'orders',
                            idfield: '_id',
                            service: 'orders',
                            title: 'Order',
                            description: 'inline orders view with brutusin:json-forms',
                            schema: true,
                            tag: 'crud-json-forms',
                            selection: true,
                            view: 'edit',
                            views: ['save'],
                            filterable: true,
                            menu:true,
                            actionMenu: true,
                            menuGroup: 'models',

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
                .find({query:{$sort:{orderId:-1},$limit:1}})
                .then((result) => {
                        var order = result.data[0];
                        order._id = (parseInt(order._id) + 100).toString();
                        order.orderId = order.orderId + 1;
                        order.createdAt = new Date();
                        order.total = (Math.random() * (137.50 - 19.5) + 0.0200).toFixed(2);
                        if(self.debug) console.info('dashboard order.orderId',order,order.orderId);
                        self.client.service('orders')
                            .create(order)
                            .then((result) => {
                                RiotControl.trigger('updateWidgetorders');
                                self.refs.ordertable.reInit();
                            })
                            .catch((error) => {
                                RiotControl.trigger(
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


