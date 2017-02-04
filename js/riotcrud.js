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

        addRoute: (route, config) => {
            config = Object.assign({}, options, config);
            routes[route] = config;
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

        start: (route) => {
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
            console.error('RiotCrudController no route found',collection, action, param);
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
        RiotCrudController.loadDependencies(route.dependencies, route.route, function() {

            RiotControl.trigger('routeStateChange',route.route);

            if (typeof route.fn === 'function') {
                currentName = null;
                currentTag = null;
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

    if (!window.RiotCrudController) {
        window.RiotCrudController = new riotCrudController;
    }

}(window, riot, $script));

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
            idField:'_id',
            showHeader: true,
            showPagination: true,
            changeLimit: true,
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
                var model = $.extend({name: name, route: '/' + name + '/' + view}, options, views[view]);
                model.view = view;
                model.views = Object.keys(views);

                //TODO: remove, use json-editor ajax mode
                if(model.schema && typeof model.schema === 'string') {
                    $.ajax({
                      url: model.schema,
                      dataType: "json",
                      async: false,
                      cache: false,
                      success: function(data){model.schema = data;}
                    });
                }

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
(function(window, riot) {

    RiotControl = {
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

    var FeatherClientMixin = {
        observable: riot.observable(),
        init: function(){
            var self = this;
            self.socket = io(self.opts.endpoint || 'http://localhost:3030');
            self.client = feathers()
              .configure(feathers.hooks())
              .configure(feathers.socketio(self.socket));
            if(typeof self.opts.service != 'undefined' && self.opts.view) {

                self.service = self.client.service(self.opts.service);

                var viewModelKey = [self.opts.service, self.opts.view].join('_');

                self.eventKeyDelete = viewModelKey + '_delete';
                self.eventKeyDeleteConfirmation = viewModelKey + '_delete_confirmation';
                RiotControl.on(self.eventKeyDeleteConfirmation, (id) => {
                    RiotControl.trigger('delete_confirmation_modal', self.opts.service, self.opts.view, id || self.opts.query.id)
                });

                self.eventKeyDeleteConfirmed = viewModelKey + '_delete';
                RiotControl.on(self.eventKeyDeleteConfirmed, (id) => {
                    self.service.remove(id)
                                .then(function(result){
                                    if(self.opts.view != 'list') {
                                        riot.route([self.opts.service, 'list'].join('/'))
                                    } else {
                                        self.refresh();
                                    }
                                })
                                .catch(function(error){
                                    RiotControl.trigger(
                                        'notification',
                                        error.errorType + ' ' + self.eventKeyDeleteConfirmed,
                                        'error',
                                        error.message
                                    );

                                });
                });


                self.eventKeyEditSave = self.opts.service + '_save';
                RiotControl.on(self.eventKeyEditSave, () => {
                    var data = self.getData();
                    if(data == false) {
                        return false;
                    }
console.log('?????', data, self.opts.idField, data[self.opts.idField]);
                    self.service.update(data[self.opts.idField],data)
                                .then(function(result){})
                                .catch(function(error){
                                    RiotControl.trigger(
                                        'notification',
                                        error.errorType + ' ' + self.eventKeyEditSave,
                                        'error',
                                        error.message
                                    );

                                });

                });

                self.eventKeyCreateSave = self.opts.service + '_create_save';
                RiotControl.on(self.eventKeyCreateSave, () => {
                    var data = self.getData();
                    if(data == false) {
                        return false;
                    }
                    delete data.id || data._id;
                    console.log('datadatadatadatadata',data)
                    self.service.create(data)
                                .then(function(result){})
                                .catch(function(error){
                                    RiotControl.trigger(
                                        'notification',
                                        error.errorType + ' ' + self.eventKeyCreateSave,
                                        'error',
                                        error.message
                                    );

                                });
                });

                self.getSchema = (cb) => {
                        //TODO: remove, use json-editor ajax mode
                    if(self.schema && typeof self.schema === 'string') {
                        $.ajax({
                          url: self.schema,
                          dataType: "json",
                          async: false,
                          cache: false,
                          success: function(data){
                                self.schema = data;
                                self.opts.schema = data; // ????
                                cb()
                            }
                        });
                    }
                }

                self.on('ALL', function(event){
                    console.log('FeatherClientMixin', event)
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


        }
    }
    if (!window.FeatherClientMixin) {
        window.FeatherClientMixin = FeatherClientMixin;
    }
    riot.mixin("FeatherClientMixin", FeatherClientMixin);

    var viewActionsMixin = {
        observable: riot.observable(),
        init: function(){
            var self = this;

            var actions = [
                {
                  name: 'view',
                  label: 'View'
                },
                {
                  name: 'edit',
                  label: 'Edit'
                },
                {
                  name: 'create',
                  label: 'Create'
                },
                {
                  name: 'delete',
                  label: 'Delete'
                },
                {
                  name: 'save',
                  label: 'Save'
                },
                {
                  name: 'list',
                  label: 'List'
                },
                {
                  name: 'print',
                  label: 'Print'
                },
                {
                  name: 'pdf',
                  label: 'PDF'
                },
                {
                  name: 'csv',
                  label: 'CSV'
                },
                {
                  name: 'json',
                  label: 'Json'
                },
                {
                  name: 'upload',
                  label: 'Upload'
                }
            ];

            self.on('update', () => {
                var  view = self.opts.view || 'undefined';

                self.opts.actions = actions.map((action, index) => {

                    action.active = false;
                    if(['delete','print','pdf','csv','json'].indexOf(action.name) != -1){
                        action.count = self.opts.selection || 0;
                    }

                    console.info('crud-action-menu update ', self.opts.selection);

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
                        RiotControl.trigger([service, action].join('_'))
                        break;
                    case 'view':
                    case 'edit':
                        riot.route([service, action, self.opts.query.id].join('/'))
                        break;
                    case 'list':
                    case 'create':
                        riot.route([service, action].join('/'))
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


}(window, riot));
