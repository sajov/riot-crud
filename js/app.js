var theme = location.search == '?theme=material' ?
        'adminbsb' :
        'gentella';
theme  = 'adminbsb';

var riotCrudTheme = '/js/riotcrud/themes/bootstrap';
var dependencyList = {
    gentella: [riotCrudTheme + '/gentella.js', riotCrudTheme + '/views/crud-views.js'],
    adminbsb: [riotCrudTheme + '/adminbsb.js', riotCrudTheme + '/views/crud-views.js', 'http://' + window.location.hostname + ':3030/socket.io/socket.io.js'],
    login: riotCrudTheme + '/login.js',register: riotCrudTheme + '/register.js'
};



$script(dependencyList[theme], theme);

$script.ready(theme, function() {

    /**
     * Riot controller
     * define custom routes
     */
    RiotCrudController.defaults({
        target: '#content',
        endpoint: 'http://' + window.location.hostname + ':3030'
    });

    /**
     * Add menu groups
     */
    // RiotCrudController.addMenuGroup('models','<i class="fa fa-table"></i>Models<span class="fa fa-chevron-down"></span>');
    // RiotCrudController.addMenuGroup('views','<i class="fa fa-desktop"></i>Views<span class="fa fa-chevron-down"></span>');
    RiotCrudController.addMenuGroup('models', {title:'CRUD',icon: 'data_usage'});
    RiotCrudController.addMenuGroup('views', {title:'CUSTOM VIEWS',icon: 'computer'});


    /**
     * Add custom view Dashboard
     */
    RiotCrudController.addRoute('dashboard',
        {
            title: 'DASHBOARD',
            icon: 'home',
            menu: true,
            route: 'dashboard',
            dependencies: [
                riotCrudTheme + '/dashboard.js',
                riotCrudTheme + '/views/crud-jsoneditor.js',
                riotCrudTheme + '/views/crud-json-forms.js'
            ],
            fn: function(id, action) {
                riot.mount('#content', 'dashboard');
            }
        }
    );

    /**
     * Add custom view Order
     */
    RiotCrudController.addRoute('customorders',
        {
            title: 'Custom view (order)',
            menu: true,
            menuGroup: 'views',
            icon: 'attach_money',
            route: 'orders/view/10',
            servicename: 'orders',
            endpoint: 'http://' + window.location.hostname + ':3030',
            dependencies: [riotCrudTheme + '/order.js'],
            fn: function(id, action) {
                // var tag = riot.mount('#content', 'order')[0];
                // console.log('TAG',tag)
            }
        }
    );

    /**
     * Add jsoneditor view Order
     */
    RiotCrudController.addRoute('categoriesjsoneditor',
        {
            title: 'Demo jsoneditor.js (category)',
            description: 'jsoneditor.js demo',
            menu: true,
            menuGroup: 'views',
            icon: 'widgets',
            route: 'categories/jsoneditor/10',
            servicename: 'orders',
            view: 'edit',
            idField: '_id',
            service: 'orders',
            tag: 'crud-jsoneditor',
            endpoint: 'http://' + window.location.hostname + ':3030',
            dependencies: [riotCrudTheme + '/views/crud-jsoneditor.js'],
        }
    );

        /**
     * Add jsoneditor view Order
     */
    RiotCrudController.addRoute('categoriesjson-forms',
        {
            title: 'Demo json-forms.js (category)',
            description: 'json-forms.js demo',
            menu: true,
            menuGroup: 'views',
            idField: '_id',
            icon: 'widgets',
            route: 'categories/json-forms/10',
            servicename: 'orders',
            view: 'edit',
            service: 'orders',
            tag: 'crud-json-forms',
            endpoint: 'http://' + window.location.hostname + ':3030',
            dependencies: [riotCrudTheme + '/views/crud-json-forms.js'],
        }
    );


    /**
     * Add jsoneditor view Order
     */
    RiotCrudController.addRoute('categoriesjson-editor',
        {
            title: 'Demo json-editor.js',
            description: 'json-editor.js products demo',
            menu: true,
            menuGroup: 'views',
            icon: 'widgets',
            route: 'categories/json-editor/10',
            servicename: 'products',
            view: 'edit',
            idField: '_id',
            service: 'products',
            tag: 'crud-json-editor',
            endpoint: 'http://' + window.location.hostname + ':3030',
            dependencies: [riotCrudTheme + '/views/crud-json-editor.js'],
        }
    );

    /**
     * Add jsoneditor view Order
     */
    RiotCrudController.addRoute('datatables',
        {
            title: 'Demo datatables.js (products)',
            menu: true,
            menuGroup: 'views',
            icon: 'format_list_bulleted',
            route: 'datatables/list',
            service: 'products',
            view: 'list',
            idField: '_id',
            target: 'div#content',
            tag: 'crud-datatables',
            buttons: ['edit','delete'],
            selection: true,
            servicename: 'products', // ???
            endpoint: 'http://' + window.location.hostname + ':3030',
            columns: {
                base_color: {
                    "data": null,
                    "render": function ( data, type, row ) {
                        return '<span class="badge badge-success" style="background-color:' + data.base_color + '">' + data.base_color + '</span>';
                    }
                }
            },
            // fn: function(id, action) {
            //     var tag = riot.mount('#content', 'crud-jsoneditor')[0];
            //     console.log('TAG',tag)
            // }
            dependencies: [riotCrudTheme + '/views/crud-datatables.js'],
        }
    );

    /**
     * Add jsoneditor view Order
     */
    RiotCrudController.addRoute('upload',
        {
            title: 'Upload data',
            description: 'Demo dropzone.js',
            menu: true,
            showHeader: true,
            menuGroup: 'views',
            icon: 'file_upload',
            route: 'upload/data',
            view: 'upload',
            idField: '_id',
            target: 'div#content',
            tag: 'crud-upload',
            buttons: ['edit','delete'],
            selection: true,
            servicename: 'products', // ???
            endpoint: 'http://' + window.location.hostname + ':3030',
            columns: {
                base_color: {
                    "data": null,
                    "render": function ( data, type, row ) {
                        return '<span class="badge badge-success" style="background-color:' + data.base_color + '">' + data.base_color + '</span>';
                    }
                }
            },
            // fn: function(id, action) {
            //     var tag = riot.mount('#content', 'crud-jsoneditor')[0];
            //     console.log('TAG',tag)
            // }
            dependencies: [riotCrudTheme + '/views/crud-upload.js'],
        }
    );

    /**
     * Add crud models with it's views
     */
    RiotCrudModel.addModel('products',
        {
            service: 'products',
            title: 'Products',
            description: 'Views',
            schema: 'http://' + window.location.hostname + ':3030/schema/product.json',
            target: 'div#content',
            endpoint: 'http://' + window.location.hostname + ':3030',
            tag: 'crud-json-editor',

        },
        {
            list: {

                description: '#/products/list',
                selection: true,
                filterable: true,
                menu:true,
                menuGroup: 'models',
                icon: 'list',
                buttons: ['edit','delete'],
                tag: 'crud-table',
                title: 'Products',
                schema: 'http://' + window.location.hostname + ':3030/schema/product.json',
                target: 'div#content',
                columns: {
                    base_color: {
                        "data": null,
                        "render": function ( data, type, row ) {
                            return '<span class="badge badge-success" style="background-color:' + data.base_color + '">' + data.base_color + '</span>';
                        }
                    }
                },
                dependencies: [
                    riotCrudTheme + '/views/crud-datatables.js'
                ]
            },
            view:{
                tag: 'crud-json-editor',
                title: 'Product Demo',
                schema: 'http://' + window.location.hostname + ':3030/schema/product.json',
                target: 'div#content',
                dependencies: [
                    riotCrudTheme + '/views/crud-json-editor.js',
                ]
            },
            create: {
                tag: 'crud-json-editor',
                title: 'Edit Products (json-editor demo)',
                target: 'div#content',
                dependencies: [
                    riotCrudTheme + '/views/crud-json-editor.js'
                ]
            },
            edit: {
                tag: 'crud-jsoneditor',
                title: 'Edit Products',
                description: 'jsoneditor.js demo',
                target: 'div#content',
                dependencies: [
                    riotCrudTheme + '/views/crud-jsoneditor.js'
                ]
            },
            delete: {}
        }
    );

    RiotCrudModel.addModel('categories',
        {
            service: 'categories',
            title: 'Categories',
            description: 'categories/list',
            schema: 'http://' + window.location.hostname + ':3030/schema/category.json',
            tag: 'crud-json-editor',
        },
        {
            list: {
                selection: true,
                filterable: true,
                menu:true,
                menuGroup: 'models',
                buttons: ['edit','delete'],
                tag: 'crud-table',
                title: 'Categories',
                description: 'Listing riot-crud listind',
                schema: 'http://' + window.location.hostname + ':3030/schema/category.json',
                target: 'div#content',
                columns: {
                    base_color: {
                        "data": null,
                        "render": function ( data, type, row ) {
                            return '<span class="badge badge-success" style="background-color:' + data.base_color + '">' + data.base_color + '</span>';
                        }
                    }
                }
            },
            view:{
                tag: 'crud-json-editor',
                title: 'Category Demo',
                schema: 'http://' + window.location.hostname + ':3030/schema/product.json',
                dependencies: [
                    riotCrudTheme + '/views/crud-json-editor.js',
                ]
            },
            create: {
                tag: 'crud-json-editor',
                title: 'Edit Products (json-editor demo)',
                target: 'div#content',
                dependencies: [
                    riotCrudTheme + '/views/crud-json-editor.js'
                ]
            },
            edit: {
                tag: 'crud-json-editor',
                title: 'Edit Products (json-editor demo)',
                target: 'div#content',
                dependencies: [
                    riotCrudTheme + '/views/crud-json-editor.js'
                ]
            },
        }
    );



    RiotCrudModel.addModel('orders',
        {
            service: 'orders',
            title: 'Orders',
            dependencies: [riotCrudTheme + '/order.js'],
            schema: 'http://' + window.location.hostname + ':3030/schema/order.json',
            target: 'div#content',
            endpoint: 'http://' + window.location.hostname + ':3030',
            tag: 'crud-json-editor',
        },
        {
            list: {
                description: 'Listing View with datatables.net',
                selection: true,
                filterable: true,
                menu:true,
                menuGroup: 'models',
                buttons: ['edit','delete'],
                tag: 'crud-table',
                title: 'Orders',
                schema: 'http://' + window.location.hostname + ':3030/schema/order.json',
                target: 'div#content',
                // endpoint: '/api/product/list',
                columns: {
                    base_color: {
                        "data": null,
                        "render": function ( data, type, row ) {
                            return '<span class="badge badge-success" style="background-color:' + data.base_color + '">' + data.base_color + '</span>';
                        }
                    }
                }
            },
            view:{
                tag: 'order',
                buttons: {save:true},
                title: 'Order',
                description: 'Custom view',
                icon: 'reorder',
                schema: 'http://' + window.location.hostname + ':3030/schema/order.json',
                target: 'div#content',
                dependencies: [
                    riotCrudTheme + '/order.js'
                ]
            },
            create: {
                tag: 'crud-json-editor',
                title: 'Create Order',
                description: 'json-editor demo',
                target: 'div#content',
                dependencies: [
                    riotCrudTheme + '/views/crud-json-editor.js'
                ]
            },
            edit: {
                tag: 'crud-json-forms',
                title: 'Edit Order',
                description: 'json-forms.js demo',
                target: 'div#content',
                dependencies: [
                    riotCrudTheme + '/views/crud-json-forms.js'
                ]
            },
            delete: {}
        }
    );

    /**
     * Add data upload from
     */
    RiotCrudController.addMenuGroup('last');
    // RiotCrudController.addRoute('upload',
    //     {
    //         title: 'Upload',
    //         description: 'Upload',
    //         menu: true,
    //         menuGroup: 'last',
    //         route: '/upload',
    //         dependencies: [
    //             riotCrudTheme + '/views/crud-upload.js',
    //         ],
    //         tag: 'crud-upload'
    //     }
    // );


    /* mount gentella admin layout*/
    riot.mount('layout');

    riot.mount('side-menu', {
        routes: RiotCrudController.getRouteMenu()
    });

    riot.mount('top-menu', {
        services: {
            products: ['created','create','update','updated','removed'],
            categories: ['created','create','update','updated','removed'],
            orders: ['created','create','update','updated','removed']
        }
    });

    if(window.location.hash === "" && window.location.hash != "#dashboard") {
       route('dashboard');
    }

    RiotCrudController.start();

})

