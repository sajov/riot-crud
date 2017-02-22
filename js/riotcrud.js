/**
 * Crud Controller
 * @param  {window} window Window
 * @param  {riot}   riot    Riot.js
 * @param  {[type]} $script [description]
 * @return {[type]}         [description]
 */
;
(function(window, riot, route, $script) {
    'use strict';

    var currentTag = null;
    var currentName = null;
    var dependencies = {};
    var routes = {};
    var menuGroups = {
        default:{
            html: false,
            routes: {}
        }
    };
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

        defaults: (config) => {
            options = Object.assign({}, options, config);
            return this;
        },

        addRoute: (path, config) => {
            config = Object.assign({}, options, config);
            routes[path] = config;
            // if(config.menu) {
            //     menuGroups[config.menuGroup || 'default'].routes = {

            //     };
            // }
            return this;
        },

        addMenuGroup: (key, opts) => {
            // menuGroups[key] = {html: html, routes: {}}
            menuGroups[key] = Object.assign({}, opts, {routes: {}})
        },

        getRoutes: () => {
            return routes;
        },

        getRouteMenu: () => {
            for (var k in routes){
                if (routes[k].menu) {
                   menuGroups[routes[k].menuGroup || 'default'].routes[k] = routes[k];
                }
            }
            return menuGroups;
        },

        addDependencies: (view, d) => {
            dependencies[view] = d;
            return this;
        },

        loadDependencies: (dependencies, tag, cb) => {
            var dep = [];
            if(typeof dependencies != 'undefined')
                dep = dependencies;

            if ($script &&  dep.length > 0) {
                $script(dep,  () => {
                    if(typeof cb === 'function') {
                        cb();
                    }
                });
            } else {
                if(typeof cb === 'function') {
                    cb();
                }
            }
        },

        start: (path) => {
            route.parser(handler);
            route.start(true);
            if (route)
                route(path);

            return this;
        },

    }

    function mount(target, tag, options) {
        if(
            currentTag!=null && tag == currentTag.root.getAttribute('riot-tag')
            && options.model == currentTag.opts.model
            ) {
            currentTag.refresh(options);
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

        var raw = collection.split('?'),
              uri = raw[0].split('/'),
              qs = raw[1],
              params = {}

        if (qs) {
            qs.split('&').forEach(function(v) {
                var c = v.split('=')
                params[c[0]] = c[1]
            })
        }

        var collection = uri[0];
        var action = uri[1];
        var param = uri[2];

        // uri.push(params)
        // return uri;


        if (typeof routes[collection] == 'undefined' && typeof routes[collection+action] == 'undefined') {
            console.error('RiotCrudController no route found',{
                collection: collection,
                action: action,
                param: param,
                routes: routes,
                uri:uri,
                qs:qs,
                params:params,
                           });
            return;
        }

        var view = routes[collection] || routes[collection+action];

        view.query = {id: param, query: route.query()};
        RiotCrudController.loadDependencies(view.dependencies, view.route, function() {

            RiotControl.trigger('routeStateChange',view.route);

            if (typeof view.fn === 'function') {
                currentName = null;
                currentTag = null;
                view.fn(collection, param, action);
            } else {
                mount(
                    view.target || target,
                    view.tag || collection + '-' + action,
                    view
                );
            }
        })
    }

    if (!window.RiotCrudController) {
        window.RiotCrudController = new riotCrudController;
    }

}(window, riot, route, $script));

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
            idfield:'_id',
            showheader: true,
            showpagination: true,
            changelimit: true,
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
                var model = $.extend({name: name, route: name + '/' + view}, options, views[view]);
                model.view = view;
                model.views = Object.keys(views);
                RiotCrudController.addRoute(name+view,model);
            }

            return this;
        }
    }

    window.RiotCrudModel = new riotCrudModel();
}(window, riot, $));

/**
 * riotCrudViewMixins
 * @param  {[type]} riot [description]
 * @return {[type]}      [description]
 */
;
(function(window, riot, route) {

    window.RiotControl = {
      _stores: [],
      addStore: function(store) {
        this._stores.push(store);
      },
      reset: function() {
        this._stores = [];
      }
    };

    ['on','one','off','trigger'].forEach(function(api){
      RiotControl[api] = function() {
        var args = [].slice.call(arguments);
        this._stores.forEach(function(el){
          el[api].apply(el, args);
        });
      };
    });

    if (typeof(module) !== 'undefined') module.exports = RiotControl;

    function ModelStore() {
      if (!(this instanceof ModelStore)) return new ModelStore()

      riot.observable(this)

      var self = this;

    }
    RiotControl.addStore(new ModelStore());
    if (!window.RiotControl) {
        window.RiotControl = RiotControl;
    }

    var FeatherClientMixinNEW = {
        test: [],
        init: function(){
            self = this;
            var defaults = {
                idfield: '_id',
                dependencies: []
            };

            Object.assign(this.opts, defaults);

            this.socket = io(this.opts.endpoint || 'http://' + window.location.hostname + ':3030');
            this.client = feathers()
              .configure(feathers.hooks())
              .configure(feathers.socketio(this.socket));

            /* init feathers service */
            if(typeof this.opts.service != 'undefined' && this.opts.view) {

                this.service = this.client.service(this.opts.service);

                var viewModelKey = [this.opts.service, this.opts.view].join('_');
                this.events = {
                    actionDeleteConfirmation: viewModelKey + '_delete_confirmation',
                    actionDeleteConfirmed: viewModelKey + '_delete',
                    actionEditSave: this.opts.service + '_save',
                    actionCreateSave: this.opts.service + '_create'
                }

                var events = Object.keys(this.events);
                for (var i = 0; i < events.length; i++) {
                    if(event == 'unmount') {
                        RiotControl.off(this.events[events[i]]);
                    } else {
                        if(this.debug || 1==1) console.info(this.events[events[i]], events[i]);
                        RiotControl.on(this.events[events[i]], this[events[i]]);
                    }
                }

                /*  events */
                this.on('*', (event) => {

                    switch(event) {
                        case 'mount':
                            this.loadDependencies();
                            break;
                        case 'before-mount':
                        case 'unmount':
                            // var events = Object.keys(this.events);
                            // for (var i = 0; i < events.length; i++) {
                            //     if(event == 'unmount') {
                            //         RiotControl.off(this.events[events[i]]);
                            //     } else {
                            //         if(this.debug || 1==1) console.info(this.events[events[i]], events[i]);
                            //         RiotControl.on(this.events[events[i]], this[events[i]]);
                            //     }
                            // }
                            break;
                        default:
                            console.info('FeatherClientMixin event:' + event, this.opts.title,this.test)
                            break;
                    }
                })

            } else {
                if(this.debug) console.warn('FeatherClientMixin no service', this.root.tagName);
            }

        },

        actionDeleteConfirmation: (id) => {
            RiotControl.trigger('delete_confirmation_modal', self.opts.service, self.opts.view, id || self.opts.query.id || self.selection)
        },

        actionDeleteConfirmed: (id) => {
            if(typeof id === "object") {
                var ids = id.map(function(_id){return _id.toString()});
                var query = {query:{ _id: { $in: ids}}};
                id  = null;
            }
            console.error('actionDeleteConfirmed',{id:id,ids:ids,query:query});

            self.service
                .remove(id,query)
                .then(function(result){
                    if(self.opts.view != 'list') {
                        route([self.opts.service, 'list'].join('/'))
                    } else {
                        self.refresh();
                    }
                })
                .catch(function(error){
                    console.error(error);
                    RiotControl.trigger('notification',error.errorType + ' ' + self.events.actionDeleteConfirmed,'error',error.message);
                });
        },

        actionEditSave: () => {
            console.error(Object.keys(self),self.opts.service);
            var data = self.getData();
            if(data == false) return false;

            self.service
                .update(data[self.opts.idfield],data)
                .then(function(result){console.warn('save'+self.opts.service,result)})
                .catch(function(error){
                    RiotControl.trigger('notification',error.errorType + ' ' + self.events.actionEditSave,'error',error.message);
                });
        },

        actionCreateSave: () => {
            var data = self.getData();
            if(data == false) return false;

            delete data.id || data._id;
            self.service
                .create(data)
                .then(function(result){})
                .catch(function(error){
                    RiotControl.trigger('notification',error.errorType + ' ' + self.events.keyactionCreateSave,'error',error.message);
                });
        },

        loadDependencies: (cb) => {
            if(self.dependencies && self.dependencies.length == 0) {
                self.loadSchema(cb);
            } else {
                if(self.debug) console.info('loadDependencies: ' + self.opts.service,self.dependencies);
                RiotCrudController.loadDependencies(
                    self.dependencies,
                    'crud-json-editor', // TODO dynamic name
                    self.loadSchema
                );
            }
        },

        loadSchema: (cb) => {
            if(self.opts.schema === true) {
                self.service.get('schema').then((result) => {
                    self.opts.schema = result;
                    self.loadData();
                }).catch((error) => {
                    console.error('loadSchema', error);
                });
            } else {
                self.loadData();
            }
        },

        loadData: (query) => {

            switch(self.opts.view) {
                case 'view':
                case 'edit':
                    if(typeof self.opts.query.id != 'undefined')
                    self.service.get(self.opts.query.id).then(function(result){
                        self.data = result;
                        self.update();
                    }).catch(function(error){
                      console.error('loadData', error);
                    });
                    break;
                case 'list':
                    self.service.find(self.opts.query).then(function(result){
                        self.data = result;
                        self.update();
                    }).catch(function(error){
                      console.error('loadData', error);
                    });
                    break;
                default:
                    break;
            }
        },
    }

    var FeatherClientMixin = {
        observable: riot.observable(),
        init: function(){
            var self = this;
            self.socket = io(self.opts.endpoint || 'http://' + window.location.hostname + ':3030');
            self.client = feathers()
              .configure(feathers.hooks())
              .configure(feathers.socketio(self.socket));
            if(typeof self.opts.service != 'undefined' && self.opts.view)
            {

                self.service = self.client.service(self.opts.service);

                var viewModelKey = [self.opts.service, self.opts.view].join('_');

                self.eventKeyDelete = viewModelKey + '_delete';
                self.eventKeyDeleteConfirmation = viewModelKey + '_delete_confirmation';
                RiotControl.on(self.eventKeyDeleteConfirmation, (id) => {
                    RiotControl.trigger('delete_confirmation_modal', self.opts.service, self.opts.view, id || self.opts.query.id || self.selection)
                });

                self.eventKeyDeleteConfirmed = viewModelKey + '_delete';
                RiotControl.on(self.eventKeyDeleteConfirmed, (id) => {
                    if(typeof id === "object") {
                        var ids = id.map(function(_id){return _id.toString()});
                        var query = {query:{ _id: { $in: ids}}};
                        id  = null;
                    }
                    self.service.remove(id,query)
                                .then(function(result){
                                    console.info(
                                        'result', result)
                                    if(self.opts.view != 'list') {
                                        route([self.opts.service, 'list'].join('/'))
                                    } else {
                                        self.refresh();
                                    }
                                })
                                .catch(function(error){
                                    console.error(error);
                                    RiotControl.trigger('notification',error.errorType + ' ' + self.eventKeyDeleteConfirmed,'error',error.message);
                                });
                });


                self.eventKeyEditSave = self.opts.service + '_save';
                RiotControl.on(self.eventKeyEditSave, () => {
                    var data = self.getData();
                    if(data == false) {
                        return false;
                    }

                    self.service.update(data[self.opts.idfield],data)
                                .then(function(result){alert(self.opts.title)})
                                .catch(function(error){
                                    RiotControl.trigger('notification',error.errorType + ' ' + self.eventKeyEditSave,'error',error.message);
                                });

                });

                self.eventKeyCreateSave = self.opts.service + '_create';
                RiotControl.on(self.eventKeyCreateSave, () => {
                    var data = self.getData();
                    if(data == false) {
                        return false;
                    }
                    delete data.id || data._id;
                    self.service.create(data)
                                .then(function(result){})
                                .catch(function(error){
                                    RiotControl.trigger('notification',error.errorType + ' ' + self.eventKeyCreateSave,'error',error.message);
                                });
                });

                self.on('ALL', function(event){
                    // console.log('FeatherClientMixin', event)
                })

                self.on('unmount', () => {
                    RiotControl.off(self.eventKeyDelete);
                    RiotControl.off(self.eventKeyDeleteConfirmed);
                    RiotControl.off(self.eventKeyDeleteConfirmation);
                    RiotControl.off(self.eventKeyEditSave);
                    RiotControl.off(self.eventKeyCreateSave);
                })

                console.info('FeatherClientMixin service loaded ' + self.opts.service);
            } else {
                console.warn('FeatherClientMixin no service');
            }
        },
        loadDependencies: (cb) => {
            if(self.dependencies && self.dependencies.length == 0) {
                self.loadSchema(cb);
            } else {
                if(self.debug) console.info('loadDependencies: ' + self.opts.service,self.dependencies);
                RiotCrudController.loadDependencies(
                    self.dependencies,
                    'crud-json-editor', // TODO dynamic name
                    self.loadSchema
                );
            }
        },
        initService: function() {},
        initServiceTrigger: function() {}, // init service event trigger
        destroyServiceTrigger: function() {}, // destroy service event trigger
    }

    if (!window.FeatherClientMixin) {
        window.FeatherClientMixin = FeatherClientMixin;
    }
    // riot.mixin("FeatherClientMixin", FeatherClientMixin);

        var OptsMixin = {
      // init method is a special one which can initialize
      // the mixin when it's loaded to the tag and is not
      // accessible from the tag its mixed in
      init: function() {
        if(!this.mytest)
            this.mytest = this.opts.title;
        console.error('optsMixin ',this.mytest);
        this.on('*', function(event) { console.log(this.opts.title + ' ??? ' +event) })
      },

      getOpts: function() {
        return this.opts
      },

      setOpts: function(opts, update) {
        this.opts = opts
        if (!update) this.update()
        return this
      }
    }

    window.optsMixin = OptsMixin;


    var viewActionsMixin = {
        observable: riot.observable(),
        init: function(){
            var self = this;

            var actions = ['View','Edit','Create','Delete','Save','List','Print','PDF','CSV','Json','Upload'].map((action, index) => {
                return {name: action.toLowerCase(), label: action};
            });

            this.on('*', (event) => {

                if(event != 'before-mount' || event != 'update')

                var  view = self.opts.view || 'undefined';

                self.opts.actions = actions.map((action, index) => {

                    action.active = false;
                    if(['delete','print','pdf','csv','json'].indexOf(action.name) != -1){
                        action.count = self.opts.selection || 0;
                    }

                    switch(view) {
                        case 'view':
                            if(['edit','delete','create','list'].indexOf(action.name) != -1){
                                action.active = true;
                                delete action.count;
                            }
                            break;
                        case 'edit':
                            if(['save','view','delete','list'].indexOf(action.name) != -1){
                                action.active = true;
                                delete action.count;
                            }
                            break;
                        case 'create':
                            if(['save','list'].indexOf(action.name) != -1){
                                action.active = true;
                            }
                            break;
                        case 'list':
                            if(['delete','create','print','pdf','csv','json','upload'].indexOf(action.name) != -1){
                                action.active = true;
                            }
                            break;
                        default:
                            break;

                    }

                    if(self.opts.buttons && self.opts.buttons[action.name]) {
                        action.active = true;
                    }

                    return action;
                });
            })

            self.click = (e) => {
                e.preventDefault();
                if(e.item.action.count === 0) {
                    return;
                }
                var service = self.opts.service || self.opts.name; // TODO: move name
                var view = self.opts.view;
                var action = e.item.action.name;
                switch(action){
                    case 'delete':
                        RiotControl.trigger([service, view, action,'confirmation'].join('_'))
                        break;
                    case 'save':
                    case 'update':
                        if(view == 'create'){
                            action = 'create';
                        }
                        RiotControl.trigger([service, action].join('_'))
                        break;
                    case 'view':
                    case 'edit':
                        route([service, action, self.opts.query.id].join('/'))
                        break;
                    case 'list':
                    case 'create':
                        route([service, action].join('/'))
                        break;
                    case 'upload':
                        break;
                    default:
                        console.error('unknown event: ' + [service, view, action].join('_'))
                        break;
                }
            }
        },
    };

    if (!window.viewActionsMixin) {
        window.viewActionsMixin = viewActionsMixin;
    }

    // register the ViewActionsMixin throughout the app
    riot.mixin("viewActionsMixin", viewActionsMixin);

}(window, riot, route));
