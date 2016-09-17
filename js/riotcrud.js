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
             console.log('RiotCrudController getRoutes',routes);
             return routes;
        },

        addDependencies: function(view, d) {
            dependencies[view] = d;
            // console.log('addDependencies', dependencies);
            return this;
        },

        start: function(route) {
            riot.route(handler)
            riot.route.start();
            riot.route.exec();
            if (route)
                riot.route(route);

            console.log('RiotCrudController start',dependencies,
            routes,
            routeNames,
            target);
            return this;
        },

    }

    function mount(target, tag, options, query) {
        if(currentTag!=null && tag == currentTag.root.getAttribute('riot-tag')) {
            currentTag.refresh(query, options);
        } else {
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
        if (typeof routes[collection] == 'undefined') {
            console.warn('RiotCrudController no route found',{
                collection: collection,
                action: action,
                param: param
            });
            return;
        }
 console.info('RiotCrudController route found',{
                collection: collection,
                action: action,
                param: param
            });
        var route = routes[collection];
        // route.options.param = param || {};
        // route.options.query = riot.route.query();
        var _target = route.target || target;
        var _tag = route.tag || collection + '-' + action;
        var _opt = route.options;

        loadDependencies(collection, action, function() {
            if (typeof route === 'function') {
                currentName = null;
                fn(collection, param, action);
            } else if (typeof route.fn === 'function') {
                route.fn(collection, action, param, currentTag,_target, _tag, _opt);
            } else {
                mount(_target, _tag, _opt, riot.route.query());
            }
        })
    }

    /**
     * Dependency loader
     * @param  {string}   collection Collection name
     * @param  {function} cb         Callback function
     */
    function loadDependencies(collection, action, cb) {
        var dep = [];
        if(routes[collection].dependencies[action])
            dep = routes[collection].dependencies[action];
        if(routes[collection].dependencies.length > 0)
            dep = routes[collection].dependencies;
        if(dependencies[collection + '/' + action] && dependencies[collection + '/' + action].length > 0)
            dep = dependencies[collection + '/' + action];

        if ($script && dep.length > 0) {
            $script(dep, collection + action, function() {
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

    var ScopeMixin = {
        init: function() {
            this.VM = this.getVM();
        },

        getVM: function() {
            var root = this
            while (root.parent) {
                root = root.parent
            }
            return root.VM || root._riot_id
        },

        getScope: function() {
            var root = this
            while (root.parent) {
                root = root.parent
            }

            return root.opts.scope || root._riot_id
        }
    }

    riot.mixin(ScopeMixin);

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
        this.models = {};
    }

    riotCrudModel.prototype = {

        defaults: function(o) {

            this.opts = $.extend( this.opts, o || {} );

            return this;
        },

        addModel: function(name, config, views) {

            var model = $.extend({}, this.opts, config || {} );

            var modelViews = {};
            for (var view in views) {
                modelViews[view] = $.extend({
                    route: name + '/' + view
                }, model, views[view]);
            }
            model.views = modelViews;

            this.models[name] = model;

            return this;
        },

        run: function() {
            // RiotCrudModel.addRoutes(); //auto init?
            // RiotCrudModel.addObserveble();
            console.info('RiotCrudModel models',this.models);
            RiotCrudViews(this.models);
            return this.models;
        }
    }

    window.RiotCrudModel = new riotCrudModel();
}(window, riot, $));

/**
 * Crud Service
 * @param  {[type]} window [description]
 * @param  {[type]} riot   [description]
 * @param  {[type]} qwest  [description]
 * @return {[type]}        [description]
 */
;(function(window, riot, $) {
    'use strict';

    var models = {};

    function riotCrudViews(m) {

        models = m;

        console.info('RiotCrudViews models', models);

        for (var n in models) {
            var views = Object.keys(models[n].views);
            console.log('views',views);
            // for(var view in models[n].views) {

            // console.log('view',models[n].views[view]);
            // }

            addRoute(n);

        }

        console.groupEnd();
    }

    function addRoute(model) {

        RiotCrudController.addRoute(
            model,
            {
                title: models[model].title,
                view: 'list',
                route: models[model].views.list.route,
                dependencies: [riotCrudTheme + '/dashboard.js'],
                fn: function(id, action) {
                    riot.mount('#content', 'dashboard');
                }
            }
        );
    }




    window.RiotCrudViews = riotCrudViews;
}(window, riot, $));



