var riotCrudTheme = '/js/riotcrud/themes/bootstrap'; //'/js/riotcrud/themes/zurb';

var dependencyList = {
    layout: [riotCrudTheme + '/menu.js', riotCrudTheme + '/dashboard.js', riotCrudTheme + '/views/crud-views.js'],
    dashboard: riotCrudTheme + '/login.js',register: riotCrudTheme + '/register.js'
};

$script(dependencyList.layout, 'layout');

$script.ready('layout', function() {

    /**
     * Riot controller
     * define custom routes
     */
    riotCrudController.target('#content');

    riotCrudController
        .route('dashboard')
        .name('Dashboard')
        .dependencies([riotCrudTheme + '/dashboard.js'])
        .fn(function(id, action) {
            riot.mount('#content', 'dashboard');
        })
        .add();


    /**
     * Riot crud model api
     * define base config
     */
    riotCrudModel.baseUrl('http://localhost:3030');
    riotCrudModel.target('div#content');


    riotCrudModel.requestFn(function(collection, view, id, params) {

    });
    riotCrudModel.responseFn(function(collection, view, id, params, response) {

    });


    /**
     * Riot crud model api
     * define define your models
     */
    $.getJSON("/schema/product.json",
        function(result){
            if(!result || typeof result.title === 'undefined')
                console.error(result);

            console.info('Schema result.title', result);

            var Products = riotCrudModel.entity('products');
            Products.schema(result);

            Products.listView()
                .restname('/api/products')
                .title('product list')
                .description('product list description')
                .perPage(30).fields([
                    riotCrudField('id', 'text')
                        .title('ID')
                        .attributes("width",100)
                        .isDetailLink(false)
                        .filter(true)
                        // .template('{ opts.id }<img src="https://www.medic-world.com/img/30x30/{ opts.image }" />'),
                        .fn(function(field, data){return data.id + '<img src="https://www.medic-world.com/img/30x30/' + data.image + '" />'})
                        ,
                    riotCrudField('sku', 'date')
                        .isDetailLink()
                        .attributes("width",150)
                        .filter(true),
                    riotCrudField('name', 'text')
                        .isDetailLink(true)
                        .filter(true),
                    riotCrudField('active')
                        .fn(function(field, data){return data.active ? '<span class="fi-check"></span>' : '<span class="fi-x"></span>'})
                        .attributes("width",100)
                        // .tag('crud-field-switch')
                        .filter(true),
                    riotCrudField('price_euro', 'number')
                        .attributes("width",120)
                        .filter(true),
                    // riotCrudField('image', 'text').template('{ opts.data.id }<img src="https://www.medic-world.com/img/30x30/{ opts.data[opts.field.name] }" />'),
                    // riotCrudField('category', 'number').fn(function(field, data){return 'john'+data[field.name]+'dudeu'}),
                ]);
            Products.editView()
                .title('product edit')
                .description('product edit description');




                riotCrudModel.run();

                // console.log('riotCrudController.getRoutes()', riotCrudController.getRoutes());
                riot.mount('side-menu', {
                    routes: riotCrudController.getRoutes()
                });

                if(window.location.hash === "") {
                   riot.route('dashboard');
                }

                riotCrudController.start();
      }
    );


});