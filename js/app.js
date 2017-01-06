var riotCrudTheme =
        location.search == '?theme=zurb' ?
        '/js/riotcrud/themes/zurb' :
        '/js/riotcrud/themes/bootstrap';

var dependencyList = {
    layout: [riotCrudTheme + '/menu.js', riotCrudTheme + '/views/crud-views.js'],
    login: riotCrudTheme + '/login.js',register: riotCrudTheme + '/register.js'
};

$script(dependencyList.layout, 'layout');

$script.ready('layout', function() {

    /**
     * Riot controller
     * define custom routes
     */
    RiotCrudController.defaults({
        target: '#content',
    });

    RiotCrudController.addMenuGroup('models','<i class="fa fa-table"></i>Models<span class="fa fa-chevron-down"></span>');
    RiotCrudController.addMenuGroup('views','<i class="fa fa-desktop"></i>Views<span class="fa fa-chevron-down"></span>');

    RiotCrudController.addRoute('dashboard',
        {
            title: '<i class="fa fa-home"></i>Dashboard',
            menu: true,
            route: '/dashboard',
            dependencies: [riotCrudTheme + '/dashboard.js'],
            fn: function(id, action) {
                riot.mount('#content', 'dashboard');
            }
        }
    );

    RiotCrudController.addRoute('customorders',
        {
            title: 'Order <small>(custom view)</small>',
            menu: true,
            menuGroup: 'views',
            route: '/customorders',
            servicename: 'orders',
            endpoint: 'http://localhost:3030',
            dependencies: [riotCrudTheme + '/order.js'],
            fn: function(id, action) {
                var tag = riot.mount('#content', 'order')[0];
                console.log('TAG',tag)
            }
        }
    );

    /**
     * Riot crud model
     * define your models
     */
    RiotCrudModel.defaults({
        target: 'div#content',
        endpoint: 'http://localhost:3030',
        requestFn: function(collection, view, id, params) {},
        responseFn: function(collection, view, id, params, response) {}
    });

    RiotCrudModel.addModel('products',
        {
            keyField: '_id',
            service: 'products',
            title: 'Products',
            description: '/products/list',
            schema: 'http://localhost:3030/schema/product.json', // string || object ?? || array [{list:'list-tag'}] ?? default
            target: 'div#content', // optional
            endpoint: 'http://localhost:3030', //'http://localhost:3030/products', rest enpoints
            tag: 'crud-jsoneditor', // default
            // dependencies: 'product-view-plugin.js',
        },
        { // mixed object || array ['list','show','create','update','delete'] ???
            list: {
                // optional
                selection: true,
                filterable: true,
                menu:true,
                menuGroup: 'models',
                buttons: ['edit','delete'],
                tag: 'crud-datatables', // default
                title: 'Products',
                schema: 'http://localhost:3030/schema/product.json', // string || object ?? || array [{list:'list-tag'}] ?? default
                target: 'div#content', // optional
                // endpoint: '/api/product/list',
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
                tag: 'crud-jsoneditor', // default
                title: 'Product Demo',
                schema: 'http://localhost:3030/schema/product.json', // string || object ?? || array [{list:'list-tag'}] ?? default
                target: 'div#content', // optional
                // endpoint: '/api/product/view',
                dependencies: [
                    riotCrudTheme + '/views/crud-jsoneditor.js',
                ] // string || array
            },
            create: {
                // fn: function() {riot.route('/product/view')}
                tag: 'crud-jsoneditor', // default
                title: 'Edit Products (json-editor demo)',
                target: 'div#content', // optional
                // fn: function() {riot.route('/products/edit/1')}
                dependencies: [
                    riotCrudTheme + '/views/crud-jsoneditor.js'
                ]
            },
            edit: {
                tag: 'crud-jsoneditor', // default
                title: 'Edit Products (json-editor demo)',
                target: 'div#content', // optional
                // fn: function() {riot.route('/products/edit/1')}
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
            description: '/categories/list',
            schema: 'http://localhost:3030/schema/category.json', // string || object ?? || array [{list:'list-tag'}] ?? default
            tag: 'crud-jsoneditor', // default
        },
        { // mixed object || array ['list','show','create','update','delete'] ???
            list: {
                // optional
                selection: true,
                filterable: true,
                menu:true,
                menuGroup: 'models',
                buttons: ['edit','delete'],
                tag: 'crud-datatables', // default
                title: 'Categories',
                schema: 'http://localhost:3030/schema/category.json', // string || object ?? || array [{list:'list-tag'}] ?? default
                target: 'div#content', // optional
                columns: {
                    base_color: {
                        "data": null,
                        "render": function ( data, type, row ) {
                            return '<span class="badge badge-success" style="background-color:' + data.base_color + '">' + data.base_color + '</span>';
                        }
                    }
                },
                dependencies: [
                    riotCrudTheme + '/views/crud-datatables.js',
                ] // string || array
            },
            view:{
                tag: 'crud-jsoneditor', // default
                title: 'Category Demo',
                schema: 'http://localhost:3030/schema/product.json', // string || object ?? || array [{list:'list-tag'}] ?? default
                dependencies: [
                    riotCrudTheme + '/views/crud-jsoneditor.js',
                ] // string || array
            },
            create: {
                tag: 'crud-jsoneditor', // default
                title: 'Edit Products (json-editor demo)',
                target: 'div#content', // optional
                dependencies: [
                    riotCrudTheme + '/views/crud-jsoneditor.js'
                ]
            },
            edit: {
                tag: 'crud-jsoneditor', // default
                title: 'Edit Products (json-editor demo)',
                target: 'div#content', // optional
                dependencies: [
                    riotCrudTheme + '/views/crud-jsoneditor.js'
                ]
            },
        }
    );



    RiotCrudModel.addModel('orders',
        {
            service: 'orders',
            title: 'Orders',
            dependencies: [riotCrudTheme + '/order.js'],
            schema: 'http://localhost:3030/schema/order.json', // string || object ?? || array [{list:'list-tag'}] ?? default
            target: 'div#content', // optional
            endpoint: 'http://localhost:3030', //'http://localhost:3030/products', rest enpoints
            tag: 'crud-jsoneditor', // default
        },
        { // mixed object || array ['list','show','create','update','delete'] ???
            list: {
                // optional
                selection: true,
                filterable: true,
                menu:true,
                menuGroup: 'models',
                buttons: ['edit','delete'],
                tag: 'crud-datatables', // default
                title: 'Order List',
                schema: 'http://localhost:3030/schema/order.json', // string || object ?? || array [{list:'list-tag'}] ?? default
                target: 'div#content', // optional
                // endpoint: '/api/product/list',
                columns: {
                    base_color: {
                        "data": null,
                        "render": function ( data, type, row ) {
                            return '<span class="badge badge-success" style="background-color:' + data.base_color + '">' + data.base_color + '</span>';
                        }
                    }
                },
                dependencies: [
                    riotCrudTheme + '/views/crud-datatables.js',
                ] // string || array
            },
            view:{
                tag: 'order', // default
                actionMenu: {save:true},
                title: 'Order <small>(custom view)</small>',
                schema: 'http://localhost:3030/schema/order.json', // string || object ?? || array [{list:'list-tag'}] ?? default
                target: 'div#content', // optional
                dependencies: [
                    riotCrudTheme + '/order.js'
                ]
            },
            create: {
                tag: 'crud-jsoneditor', // default
                title: 'Create Order (json-editor demo)',
                target: 'div#content', // optional
                dependencies: [
                    riotCrudTheme + '/views/crud-jsoneditor.js'
                ]
            },
            edit: {
                tag: 'crud-jsoneditor', // default
                title: 'Edit Order (json-editor demo)',
                target: 'div#content', // optional
                dependencies: [
                    riotCrudTheme + '/views/crud-jsoneditor.js'
                ]
            },
            delete: {}
        }
    );

    riot.mount('side-menu','side-menu', {
        routes: RiotCrudController.getRouteMenu()
    });

    riot.mount('top-menu','top-menu', {
        services: {
            products: ['created','create','update','updated','removed'],
            categories: ['created','create','update','updated','removed'],
            orders: ['created','create','update','updated','removed']
        }
    });

    if(window.location.hash === "" && window.location.hash != "#dashboard") {
       riot.route('dashboard');
    }

    RiotCrudController.start();

})

