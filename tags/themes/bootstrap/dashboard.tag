<top-widget>


    <div onclick="" class="info-box hover-expand-effect">
        <div class="icon {opts.color}">
            <i if={opts.icon} class="material-icons col-gray">{opts.icon}</i>
            <div id="pie" if={opts.pie} class="{opts.pie}" data-chartcolor="{opts.color}">{opts.sparklinedata}</div>
        </div>
        <div class="content">
            <div class="text">{opts.title}</div>
            <div class="number count-to" data-from="0" data-to="{opts.count}" data-speed="1000" data-fresh-interval="20">{opts.count}</div>
        </div>
    </div>

  <script>
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
                if( opts.title == 'Products') {
                    console.info('getData ' + opts.title);
                    self.initPlugins();
                }
            })
            .catch((error) => {RiotControl.trigger(
                        'notification',
                        error.name + ' ' + error.type ,
                        'error',
                        error.message
                    );});
    }

    self.on('*', (event) => {
        if( opts.title == 'Products')
        console.info('dashboard event ' + opts.title  , event);
    });

    self.on('updated', () => {
        if(self.opts.count) {

            if( opts.title == 'Products')
            console.info('dashboard event UPDATED' + opts.title);

        }
    });

    self.initPlugins = () => {
        initCounters();
        initCharts();

        //Widgets count plugin
        function initCounters() {
            $('.count-to').countTo();
        }

        //Charts
        function initCharts() {
            var chartColor = $.AdminBSB.options.colors[opts.color];
            $(self.pie).sparkline(undefined, {
                type: opts.sparkline ||  'bar', // line, pie, bar
                barColor: chartColor,
                negBarColor: chartColor,
                barWidth: '8px',
                height: '34px'
            });
        }
    }

  </script>

</top-widget>

<todo-list>

    <div class="card">
        <div class="header">
            <h2>{opts.title}<small>{opts.subtitle}</small></h2>
            <ul class="header-dropdown m-r--5">
                <li class="dropdown">
                    <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                        <i class="material-icons">more_vert</i>
                    </a>
                    <ul class="dropdown-menu pull-right">
                        <li><a href="javascript:void(0);">Action</a></li>
                        <li><a href="javascript:void(0);">Another action</a></li>
                        <li><a href="javascript:void(0);">Something else here</a></li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="body">
            <div each={data in opts.todos} if={key!='default'}>
                <input type="checkbox" id="basic_checkbox_1" checked={ data.done } /><label for="basic_checkbox_1">{data.todo}</label>
            </div>
        </div>
    </div>

    <script>
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
    </script>
</todo-list>

<dashboard>

        <div class="row top_tiles">

            <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <top-widget title="Orders" description="" sparkline="bar" icon="shopping_cart" service="orders" color="bg-red"></top-widget>
            </div>
            <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <top-widget title="Categories" description="" sparkline="line" sparklinedata="30, 35, 25, 8" color="cyan" icon="list" service="categories"></top-widget>
            </div>
            <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <top-widget title="Products" description="" pie="chart chart-pie" sparklinedata="30, 35, 25, 8" color="cyan" service="products"></top-widget>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 col-sm-6 col-xs-12">
                <todo-list title="Feature List" subtitle="current and following tasks"></todo-list>
                <div id="jsoneditor-container"></div>
            </div>
            <div class="col-md-6 col-sm-6 col-xs-12">
                <div id="json-forms-container"></div>
            </div>
        </div>

         <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">

            </div>
        </div>


    <script>
        var self = this;
        self.mixin(FeatherClientMixin);
        self.jsoneditorQuery = {
            id:1
        };

        self.dependencies = [
            riotCrudTheme + '/views/crud-jsoneditor.js', // TODO: bugfix
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
                            // buttons: ['create','save','list'],
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
                            // buttons: ['create','save','list'],
                            schema: 'http://localhost:3030/schema/category.json',
                            type:'inline',
                            query: {id:result.data[0]._id}
                    });
                })
                .catch((error) => {});
        }

        initPlugins = () => {
            // iCheck
            $(document).ready(function() {
                if ($("input.flat")[0]) {
                    $('input.flat').iCheck({
                        checkboxClass: 'icheckbox_flat-green',
                        radioClass: 'iradio_flat-green'
                    });
                }
            });
            // /iCheck
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
                })                              //'notification', (title, type, text)
                .catch((error) => {iotControl.trigger(
                        'notification',
                        error.name + ' ' + error.type ,
                        'error',
                        error.message
                    );
                });
        }

    </script>
</dashboard>


