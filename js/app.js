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

    /**
     * Add menu groups
     */
    RiotCrudController.addMenuGroup('models','<i class="fa fa-table"></i>Models<span class="fa fa-chevron-down"></span>');
    RiotCrudController.addMenuGroup('views','<i class="fa fa-desktop"></i>Views<span class="fa fa-chevron-down"></span>');

    /**
     * Add custom view Dashboard
     */
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

    /**
     * Add custom view Order
     */
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
     * Add a model with it's views
     */
    RiotCrudModel.addModel('products',
        {
            service: 'products',
            title: 'Products',
            description: '/products/list',
            schema: 'http://localhost:3030/schema/product.json',
            target: 'div#content',
            endpoint: 'http://localhost:3030',
            tag: 'crud-jsoneditor',

        },
        {
            list: {

                selection: true,
                filterable: true,
                menu:true,
                menuGroup: 'models',
                buttons: ['edit','delete'],
                tag: 'crud-datatables',
                title: 'Products',
                schema: 'http://localhost:3030/schema/product.json',
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
                tag: 'crud-jsoneditor',
                title: 'Product Demo',
                schema: 'http://localhost:3030/schema/product.json',
                target: 'div#content',
                dependencies: [
                    riotCrudTheme + '/views/crud-jsoneditor.js',
                ]
            },
            create: {
                tag: 'crud-jsoneditor',
                title: 'Edit Products (json-editor demo)',
                target: 'div#content',
                dependencies: [
                    riotCrudTheme + '/views/crud-jsoneditor.js'
                ]
            },
            edit: {
                tag: 'crud-jsoneditor',
                title: 'Edit Products (json-editor demo)',
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
            description: '/categories/list',
            schema: 'http://localhost:3030/schema/category.json',
            tag: 'crud-jsoneditor',
        },
        {
            list: {

                selection: true,
                filterable: true,
                menu:true,
                menuGroup: 'models',
                buttons: ['edit','delete'],
                tag: 'crud-datatables',
                title: 'Categories',
                schema: 'http://localhost:3030/schema/category.json',
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
                    riotCrudTheme + '/views/crud-datatables.js',
                ]
            },
            view:{
                tag: 'crud-jsoneditor',
                title: 'Category Demo',
                schema: 'http://localhost:3030/schema/product.json',
                dependencies: [
                    riotCrudTheme + '/views/crud-jsoneditor.js',
                ]
            },
            create: {
                tag: 'crud-jsoneditor',
                title: 'Edit Products (json-editor demo)',
                target: 'div#content',
                dependencies: [
                    riotCrudTheme + '/views/crud-jsoneditor.js'
                ]
            },
            edit: {
                tag: 'crud-jsoneditor',
                title: 'Edit Products (json-editor demo)',
                target: 'div#content',
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
            schema: 'http://localhost:3030/schema/order.json',
            target: 'div#content',
            endpoint: 'http://localhost:3030',
            tag: 'crud-jsoneditor',
        },
        {
            list: {

                selection: true,
                filterable: true,
                menu:true,
                menuGroup: 'models',
                buttons: ['edit','delete'],
                tag: 'crud-datatables',
                title: 'Order List',
                schema: 'http://localhost:3030/schema/order.json',
                target: 'div#content',
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
                ]
            },
            view:{
                tag: 'order',
                actionMenu: {save:true},
                title: 'Order <small>(custom view)</small>',
                schema: 'http://localhost:3030/schema/order.json',
                target: 'div#content',
                dependencies: [
                    riotCrudTheme + '/order.js'
                ]
            },
            create: {
                tag: 'crud-jsoneditor',
                title: 'Create Order (json-editor demo)',
                target: 'div#content',
                dependencies: [
                    riotCrudTheme + '/views/crud-jsoneditor.js'
                ]
            },
            edit: {
                tag: 'crud-jsoneditor',
                title: 'Edit Order (json-editor demo)',
                target: 'div#content',
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

