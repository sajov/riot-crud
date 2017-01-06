# riot-crud
A flexible CRUD Admin Project.
Inspired by [ng-admin](https://github.com/marmelab/ng-admin), great if you are familiar with Angular.
Also check out [rfx-stack](https://github.com/foxhound87/rfx-stack) if you like React.

> This is Experimental and under development for my personal needs

If you are interest in alternatives more lose coupled and less full stack go ahead.

## Dependencies:
* [feathers](https://github.com/feathersjs/feathers) An open source REST and realtime API layer for modern applications.
* [feathers-client](https://github.com/feathersjs/feathers-client) Client side Feathers for REST and websockets that works with NodeJS, React Native and any client framework
* [riot](https://github.com/riot/riot) Simple and elegant component-based UI library
* [gentelella](https://github.com/puikinsh/gentelella) Free Bootstrap 3 Admin Template
> Many thanks to all these Contributors for there huge work!

## Getting started

### Start Demo Server
```
npm install
npm start
```

### Start Demo Frontend
```
bower install
npm install 
npm start
```
## Dashboard (custom view)
![CRUD Demo](https://github.com/sajov/riot-crud/blob/develop/docs/crud1.png "Dashboard")
## List view (datatables)
![CRUD Demo](https://github.com/sajov/riot-crud/blob/develop/docs/crud2.png "List view Datatables")
## Show view (custom view)
![CRUD Demo](https://github.com/sajov/riot-crud/blob/develop/docs/crud3.png "Show view")
## Edit view (json-editor)
![CRUD Demo](https://github.com/sajov/riot-crud/blob/develop/docs/crud4.png "Edit view JSON-Editor")

##Features:
* Routing (riot routing)
* Modular Views (riot tags)
* Dependency loading per view (scriptjs)
* Crud client (feathers-client)
* CRUD Views (create, show, edit, list)
* Demos List view based on datatables

```

    /**
     * Riot crud controller
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
            keyField: '_id',
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
```