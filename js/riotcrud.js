/**
 * Crud Controller
 * @param  {window} window Window
 * @param  {riot}   riot    Riot.js
 * @param  {[type]} $script [description]
 * @return {[type]}         [description]
 */
;
(function(window, riot, $script) {
    'use strict';

    var currentTag = null;
    var currentName = null;
    var dependencies = {};
    var routes = {};
    var routeNames = {};
    var target = '#content';
    var options = {
            target: '#main',
            options:{},
            query:{}
        };

    /**
     * Riot Crud Controller Constructor
     * @return {function}   Self
     */
    function riotCrudController() {
        return this;
    }

    /**
     * Riot Crud Controller Api
     */
    riotCrudController.prototype = {

        defaults: function(config) {
            options = $.extend({}, options, config);
            return this;
        },

        addRoute: function(route, config) {
            config = $.extend({}, options, config);
            routes[route] = config;
            return this;
        },

        getRoutes: function() {
             return routes;
        },

        addDependencies: function(view, d) {
            dependencies[view] = d;
            return this;
        },

        start: function(route) {
            riot.route(handler)
            riot.route.start();
            riot.route.exec();
            if (route)
                riot.route(route);

            return this;
        },

    }

    function mount(target, tag, options) {
        if(
            currentTag!=null && tag == currentTag.root.getAttribute('riot-tag')
            && options.model == currentTag.opts.model
            ) {
            console.info(currentTag.opts.model);
            console.warn('riotcrud.mount if currentTag!=null');
            currentTag.refresh(options);
        } else {
            console.warn('riotcrud.mount else', target, tag, options);
            currentTag && currentTag.unmount(true)

            currentTag = riot.mount(target, tag, options)[0]
            currentName = tag
        }
    }

    /**
     * Routing handler
     * @param  {string}  collection Collection name
     * @param  {string}  action     Action type (optional)
     * @param  {integer} params     Params (optional)
     *
     * - exec fn
     */
    function handler(collection, action, param) {

        if (typeof routes[collection] == 'undefined' && typeof routes[collection+action] == 'undefined') {
            console.error('RiotCrudController no route found',{
                collection: collection,
                action: action,
                param: param
            });
            return;
        }

        var route = routes[collection] || routes[collection+action];

        route.query = {id: param, query: riot.route.query()};
        loadDependencies(route, function() {
            if (typeof route.fn === 'function') {
                currentName = null;
                route.fn(collection, param, action);
            } else {
                mount(
                    route.target || target,
                    route.tag || collection + '-' + action,
                    route
                );
            }
        })
    }

    /**
     * Dependency loader
     * @param  {string}   collection Collection name
     * @param  {function} cb         Callback function
     */
    function loadDependencies(route, cb) {
        var dep = [];

        if(typeof route.dependencies != 'undefined')
            dep = route.dependencies;

        if (typeof route.fn == 'function') {
            route.fn();
        }

        if ($script && dep.length > 0) {
            $script(dep, route.route, function() {
                cb()
            });
        } else {
            cb();
        }
    }

    // Routes
    if (!window.RiotCrudController) {
        window.RiotCrudController = new riotCrudController;
    }

}(window, riot, $script));



/**
 * riotCrudViewMixins
 * @param  {[type]} riot [description]
 * @return {[type]}      [description]
 */
;
(function(window, riot) {

    // var ScopeMixin = {
    //     init: function() {
    //         alert('init');
    //         this.VM = this.getVM();
    //     },

    //     getVM: function() {
    //         alert('init');
    //         var root = this
    //         while (root.parent) {
    //             root = root.parent
    //         }
    //         return root.VM || root._riot_id
    //     },

    //     getScope: function() {
    //         alert('init');
    //         var root = this
    //         while (root.parent) {
    //             root = root.parent
    //         }

    //         return root.opts.scope || root._riot_id
    //     }
    // }

    // riot.mixin(ScopeMixin);

}(window, riot));


/**
 * Riot crud model
 * @param  {[type]} window [description]
 * @param  {[type]} riot   [description]
 * @param  {[type]} qwest  [description]
 * @return {[type]}        [description]
 */
;(function(window, riot, $) {
    'use strict';

    function riotCrudModel() {
        this.opts = {
            title:'old',
            test:'default'
        };
    }

    riotCrudModel.prototype = {

        defaults: function(o) {
            this.opts = $.extend( this.opts, o || {} );
            return this;
        },

        addModel: function(name, config, views) {
            var options = $.extend({model:name}, this.opts, config || {} );

            for (var view in views) {

                var model = $.extend({route: '/' + name + '/' + view}, options, views[view]);

                if(model.schema && typeof model.schema === 'string') {
                    $.ajax({
                      url: model.schema,
                      dataType: "json",
                      async: false,
                      cache: false,
                      success: function(data){
                        // console.info(data)
                        model.schema = data;
                        }
                    });
                }

                RiotCrudController.addRoute(name+view,model);
            }

            return this;
        }
    }

    window.RiotCrudModel = new riotCrudModel();
}(window, riot, $));




