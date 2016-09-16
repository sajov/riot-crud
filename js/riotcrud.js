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
    var target = '#main';

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

        addRoute: function(route, config) {
            routes[route] = config;
            return this;
        },

        target: function(t) {
            target = t;
            return this;
        },

        route: function(route) {
            var self = this;
            var route = route;
            var config = {
                name: route,
                target: false,
                options: {},
                tag: false,
                fn: false,
                dependencies: []
            };
            return {
                name: function(name) {
                    config.name = name;
                    return this;
                },
                view: function(v) {
                    config.view = v;
                    return this;
                },
                target: function(t) {
                    config.target = t;
                    return this;
                },
                tag: function(t) {
                    config.tag = t;
                    return this;
                },
                options: function(o) {
                    config.options = o;
                    return this;
                },
                fn: function(f) {
                    config.fn = f;
                    return this;
                },
                dependencies: function(d) {
                    config.dependencies = d;
                    return this;
                },
                add: function() {
                    self.addRoute(route, config)
                }
            }
        },

        getRoutes: function() {
            var retval = [];
            for (var route in routes) {
                var r = routes[route];
                r.route = route;
                retval.push(r)
            }

            return retval;
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
            console.error('no route found : ', collection, param, action);
            return;
        }

        var route = routes[collection];
        route.options.param = param;
        route.options.query = riot.route.query();
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
    if (!window.riotCrudController) {
        window.riotCrudController = new riotCrudController;
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
 * Crud Service
 * @param  {[type]} window [description]
 * @param  {[type]} riot   [description]
 * @param  {[type]} qwest  [description]
 * @return {[type]}        [description]
 */
;(function(window, riot, qwest) {
    'use strict';

    function Service(baseUri, model, config) {
        console.log('Service: ',model, config);
        console.log(baseUri + '/' + (config.restname || model));
        var self = this;
        self.baseUri = baseUri;
        self.requestUrl = baseUri + '/' + (config.restname || model);
        self.model = model;
        self.config = config;
        self.currentRequest = false;
        self.init();
        riot.observable(this);

        self.on('show', function ( obj ) {
            console.log('Service show',obj, self);

            self.get('/' + obj.id, {}, function(data){
                riotux.trigger(self.model+'Store', self.model+'-show', data);
            });
        });

        self.on('edit', function ( obj ) {
            console.log('Service edit',obj);
            self.get('/' + obj.id, {}, function(data){
                riotux.trigger(self.model+'Store', self.model+'-edit', data);
            });
        });

        self.on('update', function (obj) {
            console.log('Service update',obj);
            self.post('/' + obj.id, obj.data, function(data) {
                riotux.trigger(self.model+'Store', self.model+'-update', data);
            });
        });

        self.on('list', function ( obj ) {
            self.get('' + self.prepareParams(obj.params), {} , function(data){
                riotux.trigger(self.model+'Store', self.model+'-list', data);
            });
        });

        self.on('creation', function ( obj ) {
            console.log('creation',obj)
            self.post('', obj.params , function(data){
                console.log('POSTED response', data);
                // riotux.trigger(self.model+'Store', self.model+'-list', data);
            });
        });

        self.on('delete', function(obj) {
            self.delete('/' + obj.id, {}, function(data){
                console.log('deleted response', data);
                // riotux.trigger(self.model+'Store', self.model+'-list', data);

            });
        })

        self.on('push', function ( obj ) {
            riot.route(obj.model+'/'+obj.view+self.prepareParams(obj.params));
        })

        self.on('update', function ( params ) {
            self.get('' + self.prepareParams(params) , function(data){console.info('list: ', params, data)});
        });

        self.on('request', function( query ) {
            console.info('Service request',query);
        });

        return this;
    }

    Service.prototype = {

        init: function() {
            // qwest.base
            this.qwest = qwest;
            this.qwest.setDefaultOptions({
                dataType: 'arraybuffer',
                responseType: 'json',
                cache: false,
                headers: {
                    'Cache-Control': '',
                }
            });
        },

        get: function(url, params, cb) {
            if(self.currentRequest)
                self.currentRequest.abort();

            self.currentRequest = this.qwest.get(this.requestUrl + url)
                .then(function(xhr, response) {
                    self.currentRequest = false;
                    cb({xhr:xhr,response:response});
                })
                .catch(function(e, xhr, response) {});
            return this;
        },

        post: function(url, params, cb) {
            this.qwest.post(this.requestUrl + url, JSON.stringify(params))
                .then(function(xhr, response) {
                    cb({xhr:xhr,response:response});
                })
                .catch(function(e, xhr, response) {});
            return this;
        },

        delete: function(url, params, cb) {
            this.qwest['delete'](this.requestUrl + url)
                .then(function(xhr, response) {
                    cb({xhr:xhr,response:response});
                })
                .catch(function(e, xhr, response) {});
            return this;
        },

        prepareParams: function(params) {
            if(!params)
                return '';

            if(typeof params == 'string')
                return '?' + params;

            var query = [];

             Object.keys(params).map(function(k) {
                if(k == 'sort' && params[k] != false) {
                    query.push(k + '=' + params[k])
                } else if(typeof params[k] == 'string') {
                    query.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                } else if(Number.isInteger(params[k])) {
                    query.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                } else if(Array.isArray(params[k]) && params[k].length > 0) {
                    query.push(encodeURIComponent(k) + '=' + JSON.stringify(params[k]))
                } else if(params[k] !== null && typeof params[k] === 'object' && !Array.isArray(params[k]) && Object.keys(params[k]).length>0){
                    query.push(encodeURIComponent(k) + '=' + JSON.stringify(params[k]));
                }
            })
             return query.length == 0 ? '' : '?' + query.join('&');
        },
    }

    function Destroy() {
        var self = this;
        riot.observable(self);
        self.on('confirmDestroy', function(){

        })
    }

    window.riotCrudService = Service;
}(window, riot, qwest));

/**
 * riotCrudView
 * @param  {[type]} window [description]
 * @param  {[type]} riot    [description]
 * @return {[type]}         [description]
 */
;
(function(window, riot) {
    'use strict';

    var models = {};
    var baseUrl = '';
    var target = '';

    function riotCrudView(config) {
        models = config.models;
        baseUrl = config.baseUrl;
        target = config.target;
        console.log('riotCrudView',models,baseUrl,target);
        for (var model in models) {
            for (var view in models[model]) {
                if (view == 'show') {
                    showViewGenerator(model, view);
                } else if (view == 'edit') {
                    editViewGenerator(model, view);
                } else if (view == 'creation') {
                    creationViewGenerator(model, view);
                } else if (view == 'list') {
                    listViewGenerator(model, view);
                } else if (view == 'tree') {
                    treeViewGenerator(model, view);
                } else if (view == 'deletion') {
                    deletionViewGenerator(model, view);
                }

                if(models[model][view].dependencies.length > 0) {
                    riotCrudController.addDependencies(model + '/' + view,models[model][view].dependencies);
                }
            }
            // console.log('riotCrudView',model, view, config.models[model][])
            riotCrudController
                .route(model)
                .name(model.charAt(0).toUpperCase() + model.slice(1).toLowerCase())
                .view(model + '/list')
                .add();

            var Service = new riotCrudService(config.baseUrl,model, models[model][view]);
            riotux.addStore(model + 'Store', Service);
        }
    }

    function listViewGenerator(model, view) {

        var config = models[model][view];
        var tagName = model + '-' + view;
        var template = '';

        if (config.template) {
            template = config.template;
        } else {
            template = '<crud-view-list data="{opts.data}" opts="{opts}"></crud-view-list>';
        }

        riot.tag(tagName, template, function(opts) {
            var tag = this;
            tag.VM = {
                model: model,
                modelStore: model+'Store',
                config: config,
                total: 0,
                pages: [],
                pagesCurrent: 1,
                pagesTotal: 0,
                rows: [],
                query: {},
                toggleFilter: false,
                param: tag.opts.param,
                selected: false,
                selectedIds: [],
                requestObj: {
                    sort: false,
                    where: {},
                    skip: 0,
                    limit:30
                },
                testdate: function(){
                    return new Date();
                },
                show: function(el) {
                    var _id = el.target.id;
                    riot.route(tag.VM.model + '/show/' + _id);
                },
                edit: function(el) {
                    riot.route(tag.VM.model + '/edit/' + el.item.row.id);
                },

                list: function(el) {
                    riot.route(tag.VM.model + '/list');
                },

                creation: function(el) {
                    riot.route(tag.VM.model + '/creation/');
                },
                select: function(e) {
                    if (e.target.checked == false) {
                        tag.VM.selectedIds.splice(tag.VM.selectedIds.indexOf(e.item.row.id),1);
                    } else {
                        tag.VM.selectedIds.push(e.item.row.id)
                    }
                    tag.VM.toCSV();
                    tag.update();
                },
                selectAll: function(e) {
                    tag.VM.selected = e.target.checked;
                    if (e.target.checked == false) {
                        tag.VM.selectedIds = [];
                    } else {
                        tag.VM.rows.forEach( function(element, index) {
                            tag.VM.selectedIds.push(element.id || index);
                        });
                    }
                    tag.VM.toCSV();
                    tag.update();
                },
                toCSV: function() {
                    var csv = 'a;b;c';
                    // tag.VM.rows.forEach( function(element, index) {
                    //         for( field in elements)
                    //             csv += element.join(';')+'\n'
                    // });
                    csv = 'data:text/csv;charset=utf-8,' + csv;
                    tag.VM.csvData = encodeURI(csv);
                },
                destroy: function(e) {
                    console.log(tag);
                    // console.log(riot.route(tag.VM.model + '/list22'));
                    riotux.trigger(tag.VM.model+'Store','delete',{tag:tag.root.getAttribute('riot-tag'), id: e.target.id});
                    riotux.trigger(tag.VM.model+'Store','list',{tag:tag.root.getAttribute('riot-tag'), id: e.target.id});

                    tag.triggerUpdate();

                },
                destroyModal: function(e) {

                    tag.tags['crud-view-list'].tags['crud-modal-destroy'].opts = {id: e.item.row.id, name: e.item.row.name};
                    tag.tags['crud-view-list'].tags['crud-modal-destroy'].update();
                    // console.log('????');
                    // console.log(tag.tags['crud-view-list'].tags['crud-modal-destroy']);
                    // console.log('????');

                    // riotux.trigger(tag.VM.model+'Store','delete',{tag:tag.root.getAttribute('riot-tag'), id: e.item.row.id});
                },
                gotoPage: function(el) {
                    var page = el.item  ? parseInt(el.item.p) : parseInt(el.srcElement.getAttribute('data-page'));
                    tag.VM.requestObj.skip = page > 1 ? parseInt((page*tag.VM.requestObj.limit)-tag.VM.requestObj.limit) : 0;

                    tag.triggerUpdate();
                },
                routeTo: function(el) {

                    riot.route(tag.VM.model + '/show/' + el.item.row.id);
                },

                request: function() {
                    riotux.trigger(tag.VM.modelStore,'list',tag.VM.param);
                },

                sort: function(el) {
                    tag.VM.config.fields.forEach(function(element, index) {
                        if (element.name == el.item.field.name) {
                            if (tag.VM.config.fields[index].sortDir == '' || tag.VM.config.fields[index].sortDir == 'fi-arrow-down') {
                                tag.VM.config.fields[index].sortDir = 'fi-arrow-up';
                                tag.VM.requestObj.sort = tag.VM.config.fields[index].name + ' asc';
                            } else {
                                tag.VM.config.fields[index].sortDir = 'fi-arrow-down';
                                tag.VM.requestObj.sort = tag.VM.config.fields[index].name + ' desc';
                            }
                        } else {
                            tag.VM.config.fields[index].sortDir = '';
                        }
                    });
                    tag.triggerUpdate();
                },

                showFilter: function(){
                    if(tag.VM.toggleFilter == true) {
                        tag.VM.toggleFilter = false;
                    } else {
                        tag.VM.toggleFilter = true;
                    }

                },
                filter: function(el) {
                    var str = el.target.value;
                    if (str === '') {
                        delete tag.VM.requestObj.where[el.item.field.name];
                    } else {
                        delete tag.VM.requestObj.where[el.item.field.name];
                        tag.VM.requestObj.where[el.item.field.name] = {
                            contains: str // TODO remove this contains to request before after methods
                        };
                    }
                    tag.triggerUpdate();
                },
                search: function(el) {
                    console.log('search', el.target.value);
                    console.log('search', $(el.target).data);
                    var str = el.target.value;
                    if (str === '') {
                        delete tag.VM.requestObj.search;
                    } else {
                        ['id', 'name', 'sku', 'price_euro'].forEach(function(element, index) {
                            tag.VM.requestObj.where[element] = {
                                contains: str
                            };
                        });
                    }
                }
            };

            riotux.on(tag.VM.modelStore, tag.VM.model + '-list', function(response){
                console.log('tag.VM',tag.VM);

                //TODO: remove heade logic to VM.response
                // if(xhr.getResponseHeader('X-Total-Count')) {
                //     cb({total:xhr.getResponseHeader('X-Total-Count'), rows:response})
                // } else {
                //     cb(xhr,response);
                // }
                tag.VM.rows = response.response;
                tag.VM.total = response.xhr.getResponseHeader('X-Total-Count');
                tag.VM.param = response.param;
                tag.VM.query = response.query;

                tag.VM.pages = [];
                tag.VM.pagesTotal = parseInt(tag.VM.total/tag.VM.requestObj.limit);
                tag.VM.pagesCurrent = tag.VM.requestObj.skip > 0 ? parseInt(tag.VM.requestObj.skip/tag.VM.requestObj.limit)+1 : 1;
                var start = tag.VM.pagesCurrent - parseInt(2);
                var end = tag.VM.pagesCurrent + parseInt(2);
                var total = parseInt(tag.VM.pagesTotal);
                var range = [];
                for (var i = start; i <= end; i++) {
                    if(i > 0 && i <= total) {
                        tag.VM.pages.push(i);
                    }
                }


                // opts.data = response.rows;
                tag.update();
                console.timeEnd('MOUNT')
            })

            tag.refresh = function(params, options) {
                tag.mergeParams(params);
                riotux.trigger(tag.VM.modelStore,'list',{tag:tag.root.getAttribute('riot-tag'), params:params});
            }

            riotux.on(tag.VM.modelStore, tag.VM.model + '-list', function(){

            })
            tag.triggerUpdate = function() {
                console.time('MOUNT')
                riotux.trigger(tag.VM.modelStore,'push',{model:tag.VM.model, view:'list', params:tag.VM.requestObj});
            }

            tag.on('mount', function(){
                console.time('MOUNT')
                tag.VM.config.menu.creation = true;
                tag.VM.config.menu.show = false;
                tag.VM.config.menu.edit = false;
                riotux.trigger(tag.VM.modelStore,'list',{tag:tag.root.getAttribute('riot-tag'), params:tag.VM.requestObj});
            })

            tag.mergeParams = function(params) {
                Object.keys(params).map(function(key){
                    if(key === 'where' && params[key] && typeof params[key] ==='string') {
                        params[key] = JSON.parse(params[key]);
                    }
                    tag.VM.requestObj[key] = params[key];
                })
            }

        })
    }

    function showViewGenerator(model, view) {
        var config = models[model][view];
        var tagName = model + '-' + view;
        var template = '';

        if (config.template) {
            template = config.template;
        } else {
            template = '<crud-view-show data="{opts.data}" opts="{opts}"></crud-view-show>';
        }

        riot.tag(tagName, template, function(opts){
            var tag = this;

            tag.VM = {
                model: model,
                modelStore: model+'Store',
                config: config,
                list: function() {
                    riot.route(model + '/list/');
                },
                edit: function() {
                    riot.route(model + '/edit/' + tag.opts.param);
                },
                creation: function(el) {
                    riot.route(model + '/creation/');
                },
                destroy: function() {

                },
                destroyModal: function() {
                    $('#destroyModal').foundation('open');
                }
            }

            tag.refresh = function(params, options) {
                query = Object.isSealed(query) ? query : {id: options.param};

                riotux.trigger(tag.VM.modelStore,'show',{tag:tag.root.getAttribute('riot-tag'), params:params});
            }

            tag.triggerUpdate = function() {
                console.time('MOUNT')
                riotux.trigger(tag.VM.modelStore,'push',{model:tag.VM.model, view:'show', params:tag.VM.requestObj});
            }

            tag.on('mount', function(){
                console.time('MOUNT');
                tag.VM.config.menu.destroy = true;
                riotux.trigger(tag.VM.modelStore,'show',{tag:tag.root.getAttribute('riot-tag'), id:opts.param});
            })


            riotux.on(tag.VM.modelStore, tag.VM.model + '-show', function(response){
                tag.VM.row = response.response;
                console.timeEnd('MOUNT');
                tag.update();
            })
        })
    }

    function editViewGenerator(model, view) {
        var config = models[model][view];
        var tagName = model + '-' + view;
        var template = '';

        if (config.template) {
            template = config.template;
        } else {
            template = '<crud-view-edit data="{opts.data}" opts="{opts}"></crud-view-edit>';
        }

        riot.tag(tagName, template, function(opts){
            var tag = this;
            tag.VM = {
                model: model,
                config: config,
                list: function() {
                    riot.route(model + '/list/');
                },
                show: function() {
                    riot.route(model + '/show/' + tag.opts.param);
                },
                destroy: function() {

                },
                /* this can be overwritten inside custom tags */
                save: function() {
                    console.log('save data edit', data);
                    // params = Object.isSealed(params) ? params : {id: options.param};
                    // console.log('save data edit', params,'??');
                    // riotux.trigger(tag.VM.model+'Store','edit',params);
                },
                destroyModal: function() {
                    $('#destroyModal').foundation('open');
                }

            }

            tag.refresh = function(params, options) {
                console.log('refresh edit', params, options);
                params = Object.isSealed(params) ? params : {id: options.param};
                console.log('refresh edit', params,'??');
                riotux.trigger(tag.VM.model+'Store','edit',params);
            }



            tag.triggerUpdate = function() {
                console.log('triggerUpdate edit', this.opts);
                riotux.trigger(tag.VM.model+'Store','push',{model:tag.VM.model, view:'edit', params:tag.VM.requestObj});
            }

            tag.on('mount', function(){
                tag.VM.config.menu.destroy = true;

                console.time('MOUNT')
                console.log('MOUNT edit', this.opts);
                riotux.trigger(tag.VM.model+'Store','edit',{tag:tag.root.getAttribute('riot-tag'), id:opts.param});
            })

            riotux.on(tag.VM.model + 'Store', tag.VM.model + '-edit', function(response){
                tag.VM.row = response.response;
                console.timeEnd('MOUNT')
                tag.update();
            })
        })
    }

    function creationViewGenerator(model, view) {
        var config = models[model][view];
        var tagName = model + '-' + view;
        var template = '';
        if (config.template) {
            template = config.template;
        } else {
            template = '<crud-view-creation data="{opts.data}" opts="{opts}"></crud-view-creation>';
        }

        riot.tag(tagName, template, function(opts){
            var tag = this;
            tag.VM = {
                model: model,
                config: config,
                list: function() {
                    riot.route(model + '/list/');
                },
                save: function() {
                    console.log('SAVE');
                    var data = {};
                    tag.VM.config.fields.forEach( function(field) {
                        if(tag.tags['crud-view-creation'][field.name]) {
                            data[field.name] = tag.tags['crud-view-creation'][field.name].value;
                            console.log(field.name+':? ',tag.tags['crud-view-creation'][field.name].value);
                        }
                    });
                    console.log('CREATE', data);
                    // <crud-modal-added>
                    riotux.trigger(tag.VM.model+'Store','creation',{tag:tag.root.getAttribute('riot-tag'), params:data});
                }
            }



            tag.refresh = function(params, options) {
                console.time('MOUNT')
                riotux.trigger(tag.VM.model+'Store','creation',{tag:tag.root.getAttribute('riot-tag'), params:params});
            }

            tag.triggerUpdate = function() {
                console.time('MOUNT')
                riotux.trigger(tag.VM.model+'Store','push',{model:tag.VM.model, view:'creation', params:tag.VM.requestObj});
            }

            tag.on('mount', function(){
                console.time('MOUNT')
            })

            riotux.on(tag.VM.model + 'Store', tag.VM.model + '-creation', function(response){
                tag.VM.row = response.response;
                console.timeEnd('MOUNT')
            })
        })
    }

    function deletionViewGenerator() {}

    function treeViewGenerator(model, view) {

        var config = models[model][view];
        var tagName = model + '-' + view;
        var template = '';

        if (config.template) {
            template = config.template;
        } else {
            var yields = [];
            config.fields.forEach(function(field, i) {
                if (field.template) {
                    // var yieldName = field.name;
                    // yields.push('<yield to="' + field.name + '">' + field.template + '</yield>');
                    // config.fields[i].tag = true;
                    var yieldName = model + view + field.name;
                    // yields.push('<yield to="' + field.name + '">' + field.template + '</yield>');
                    // yields.push('<yield to="yield' + i + '">' + field.template + '</yield>');
                    config.fields[i].tag = yieldName;
                    riot.tag(yieldName, field.template);

                }
            })
            template = '<crud-view-tablenew></crud-view-tablenew>';
        }
        riot.tag(tagName, template, function(opts){

        })
    }

    if (!window.riotCrudView) {
        window.riotCrudView = riotCrudView;
    }
})(window, riot);

/**
 * riotCrudSchemaBuilder
 * @param  {object} window Window
 * @param  {object} riot   Riot.js
 * @return {mixed}        Riot crud model api
 */
;
(function(window, riot) {
    'use strict';

    var config = {
        baseUrl: '',
        target: '',
        models: {},
        schemas: {},
        requestFn: false,
        responseFn: false
    }

    /**
     * riotCrudModel constructor
     * @return {mixed} Api
     */
    function riotCrudModel() {}

    riotCrudModel.prototype = {
        baseUrl: function(baseUrl) {
            config.baseUrl = baseUrl;
            return this;
        },
        target: function(target) {
            config.target = target;
        },
        getModel: function(model) {
            if (typeof model == 'string')
                return config.models[model];

            return models;
        },
        entity: function(model, alias) {
            return new Entity(model, alias);
        },

        requestFn: function(fn) {
            config.requestFn = fn;
        },

        responseFn: function(fn) {
            config.responseFn = fn;
        },

        run: function() {
            console.log('riotCrud models', config);
            for (var model in config.models) {
                var views = Object.keys(config.models[model]);
                for (var view in config.models[model]) {
                    if (Object.keys(config.models[model][view].menu).length == 0) {
                        var menu = {};
                        for(var i in views) {
                            if(views[i] != view) {
                                menu[views[i]] = true;
                            }
                        }
                        config.models[model][view].menu = menu;
                    }
                }
            }
            console.log('riotCrud models', config);
            riotCrudView(config);
        }
    }

    function Entity(model, alias) {
        config.models[model] = {};
        config.schemas[model] = {};
        config.restname = false;
        this.model = model;
    }

    Entity.prototype = {
        schema: function(schema) {
            config.schemas[this.model] = schema;
            return this;
        },
        restname: function(r) {
            config.restname = r;
            return this;
        },
        requestFn: function(r) {
            config.requestFn = r;
            return this;
        },
        responseFn: function(r) {
            config.rresponseFn = r;
            return this;
        },
        listView: function() {
            return new EntityApi(this.model, 'list');
        },
        treeView: function() {
            return new EntityApi(this.model, 'tree');
        },
        creationView: function() {
            return new EntityApi(this.model, 'creation');
        },
        showView: function() {
            return new EntityApi(this.model, 'show');
        },
        editView: function() {
            return new EntityApi(this.model, 'edit');
        },
        deletionView: function() {
            return new EntityApi(this.model, 'deletion');
        }
    }

    function EntityApi(model, view) {
        this.model = model;
        this.view = view;

        if (typeof config.models[model] == 'undefined')
            config.models[model] = {};

        if (typeof config.models[model][view] == 'undefined') {
            config.models[model][view] = {
                baseUrl: config.baseUrl,
                restname: false,
                target: config.target,
                title: '',
                description: '',
                menu: {},
                template: false,
                tag: false,
                fn: false,
                tagname: false,
                fields: [],
                requestHandler: false,
                responseHandler: false,
                dependencies: [],
                view: view,
                restname: config.restname || 'dfsf',
                schema: config.schemas[model] || {}

            };
            if (view == 'listView') {
                config.models[model][view] = extend(config.models[model][view], {
                    filter: [],
                    infinitePagination: '',
                    actions: '',
                    perPage: 30,
                    perPageOptions: [30,90,150],
                    infinitePagination: '',
                    batchActions: '',
                    listActions: ''
                });
            }
        }
        return this;
    }

    EntityApi.prototype = {
        title: function(title) {
            if (typeof title == 'undefined')
                return config.models[this.model][this.view].title;
            config.models[this.model][this.view].title = title;
            return this;
        },
        description: function(description) {
            if (typeof description == 'undefined')
                return config.models[this.model][this.view].description;
            config.models[this.model][this.view].description = description;
            return this;
        },
        menu: function(menu) {
            var self = this;
            if (typeof menu == 'undefined')
                return config.models[this.model][this.view].menu;
            if (typeof menu == 'string')
                config.models[this.model][this.view].menu[menu] = true;
            if (Array.isArray(menu)) {
                menu.forEach( function(element) {
                    config.models[self.model][self.view].menu[element] = true;
                });
            }
            return this;
        },
        template: function(template) {
            if (typeof template == 'undefined')
                return config.models[this.model][this.view].template;

            config.models[this.model][this.view].template = template;

            return this;
        },

        /* deprecated */
        fields: function(args) {
            if (typeof args == 'undefined') {
                return config.models[this.model][this.view].fields;
            }
            var self = this;
            args.forEach(function(element, index) {

                if (typeof element == 'object') {
                    // config.models[self.model][self.view].fields.push(element.getConfig());
                    config.models[self.model][self.view].fields.push(element.getConfig());
                } else {
                    var f = field(element).getConfig()
                        // config.models[self.model][self.view].fields.push(f);
                    config.models[self.model][self.view].fields.push(f);
                }
            })

            return this;
        },
        /* listView methods */
        infinitePagination: function() {},

        actions: function() {},

        perPage: function(opt) {
            config.models[this.model][this.view].perPage = opt;
            return this;
        },

        perPageOptions: function(perPageOptions) {
            config.models[this.model][this.view].perPageOptions = perPageOptions;
            return this;
        },

        batchActions: function() {},

        listActions: function() {},

        filter: function(args) {
            if (typeof args == 'undefined') {
                return config.models[this.model][this.view].filter;
            }
            config.models[this.model][this.view].filter = args;
            return this;
        },

        dependencies: function(d) {
            config.models[this.model][this.view].dependencies = d;
            return this;
        },

        fn: function(t) {
            config.models[this.model][this.view].fn = t;
            return this;
        },

        restname: function(r) {
            config.models[this.model][this.view].restname = r;
            return this;
        },

        schema: function(s) {
            config.models[this.model][this.view].schema = s;
            return this;
        }
    }

    /**
     * Field Factory (deprecated by json-schema)
     * @param  {string} name Field name
     * @param  {string} type Field type
     * @return {mixed}       This
     */
    function field(name, type) {

        var fl = {
            name: name,
            type: type || 'string',
            inputType: 'text',
            title: (name.charAt(0).toUpperCase() + name.slice(1)).replace('_', ' '),
            description: '',
            map: '',
            cssClasses: '',
            attr: {},
            width:100,
            template: false,
            targetEntity: '',
            targetField: '',
            singleApiCall: '',
            choices: '',
            validation: '',
            remoteComplete: '',
            sortField: '',
            sortDir: '',
            isDetailLink: false,
            fn: false
        };

        return {
            title: function(title) {
                fl.title = title;
                return this;
            },

            name: function(name) {
                if (typeof name == 'undefined')
                    fl.name = name;
                return this;
            },

            cssClasses: function(cssClasses) {
                fl.cssClasses = cssClasses;
                return this;
            },

            attributes: function(key,value) {
                fl.attr[key] = value;
                return this;
            },

            mapmap: function() {
                fl.map = map;
                return this;
            },

            template: function(template) {
                fl.template = template;
                return this;
            },

            tag: function(tag) {
                fl.tag = tag;
                return this;
            },

            inputType: function(inputType) {
                fl.inputType = inputType;
                return this;
            },

            targetEntity: function(targetEntity) {
                fl.targetEntity = targetEntity;
                return this;
            },

            targetField: function(targetField) {
                fl.targetField = targetField;
                return this;
            },

            singleApiCall: function(singleApiCall) {
                fl.singleApiCall = singleApiCall;
                return this;
            },

            choices: function(choices) {
                fl.choices = choices;
                return this;
            },

            validation: function(validation) {
                fl.validation = validation;
                return this;
            },

            remoteComplete: function(remoteComplete) {
                fl.remoteComplete = remoteComplete;
                return this;
            },

            sortField: function(sortField) {
                fl.sortField = sortField;
                return this;
            },

            sortDir: function(sortDir) {
                fl.sortDir = sortDir;
                return this;
            },

            filter: function(filter) {
                fl.filter = filter;
                return this;
            },

            isDetailLink: function(isDetailLink) {
                fl.isDetailLink = typeof isDetailLink == 'undefined' ? true : isDetailLink;
                return this;
            },

            getConfig: function() {
                return fl;
            },
            fn: function(t) {
                fl.fn = t;
                return this;
            }

        }
    }


    /**
     * Extend polyfill
     */
    function extend(target, source) {
        target = target || {};
        for (var prop in source) {
            if (typeof source[prop] === 'object') {
                target[prop] = extend(target[prop], source[prop]);
            } else {
                target[prop] = source[prop];
            }
        }
        return target;
    }

    if (!window.riotCrudModel) {
        window.riotCrudModel = new riotCrudModel();
        window.riotCrudField = field;
    }
}(window, riot));