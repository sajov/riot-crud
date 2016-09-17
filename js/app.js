var riotCrudTheme =
        location.search == '?theme=zurb' ?
        '/js/riotcrud/themes/zurb' :
        '/js/riotcrud/themes/bootstrap';

var dependencyList = {
    layout: [riotCrudTheme + '/menu.js', riotCrudTheme + '/dashboard.js', riotCrudTheme + '/views/crud-views.js'],
    login: riotCrudTheme + '/login.js',register: riotCrudTheme + '/register.js'
};

$script(dependencyList.layout, 'layout');

$script.ready('layout', function() {

    // var riotCrudTheme = '/js/riotcrud/themes/bootstrap'; //'/js/riotcrud/themes/zurb';


    // var dependencyList = {
    //     layout: [riotCrudTheme + '/menu.js', riotCrudTheme + '/dashboard.js', riotCrudTheme + '/views/crud-views.js'],
    //     dashboard: riotCrudTheme + '/login.js',register: riotCrudTheme + '/register.js'
    // };

    // var onLoadDependencies = [];

    // /*router util*/
    // $.each(dependencyList.layout,function(index, script) {
    //     onLoadDependencies.push(
    //         $.ajax({
    //           url: script,
    //           dataType: "script",
    //           cache: false,
    //           success: function(){console.info(script)}
    //         })
    //     );
    // });

    // /*router util*/
    // $.when(onLoadDependencies)
    //     .done(function(first_call, second_call, third_call){
    //         //do something
    //         console.info('dep');
    //     })
    //     .fail(function(){
    //         //handle errors
    //         console.error('dep?');
    //     });


    console.info('script ready');
    /**
     * Riot controller
     * define custom routes
     */
    RiotCrudController.defaults({
        target: '#content'
    });


    /**
     * Riot crud model
     * define your models
     */
    RiotCrudModel.defaults({
        baseUrl: 'http://localhost:3030',
        target: 'div#content',
        requestFn: function(collection, view, id, params) {},
        responseFn: function(collection, view, id, params, response) {}
    });

    RiotCrudModel.addModel('product',{
            title: 'Products',
            schema: 'product.json', // string || object ?? || array [{list:'list-tag'}] ?? default
            target: 'div#content', // optional
            endpoint: '/api/product',
            tag: 'product-view',
            dependencies: 'product-view-plugin.js',
        },{ // mixed object || array ['list','show','create','update','delete'] ???
            list: {
                // optional
                tag: 'crud-view-datatables', // default
                title: 'Products',
                schema: 'product.json', // string || object ?? || array [{list:'list-tag'}] ?? default
                target: 'div#content', // optional
                endpoint: '/api/product/list',
                tag: 'product-view',
                dependencies: '' // string || array
            },
            view:{

            }
        });

    RiotCrudModel.addModel('category',{
        title: 'Category',
        schema: 'category.json', // string || object ?? || array [{list:'list-tag'}] ?? default
        target: 'div#content', // optional
        endpoint: '/api/category',
        tag: 'category-view',
        dependencies: 'category-view-plugin.js',
        }, {
            list: {
            },
            view:{

            }
        }
    );

    RiotCrudModel.run();

    // mount menu here will ignore following addRoute
    riot.mount('side-menu','side-menu', {
        routes: RiotCrudController.getRoutes()
    });

    RiotCrudController.addRoute('dashboard',
        {
            title: 'Dashboard',
            // target: '???',
            dependencies: [riotCrudTheme + '/dashboard.js'],
            fn: function(id, action) {
                riot.mount('#content', 'dashboard');
            }
        }
    );

    RiotCrudController.start('dashboard');



    // RiotCrudModel
    // RiotCrudRoute.start(RiotCrudModel.getRoutes())
    // RiotCrudObservebla

})

