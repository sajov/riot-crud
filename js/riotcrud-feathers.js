
var RiotControl = {
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

  // Could pull this from a server API.
  // self.on('delete', function(product) {
  //   console.log('has_deleted', self.products)
  //   self.trigger('has_deleted', self.products)
  // })

  // self.on('update', function() {
  //   // here it can query server in real scenario
  //   console.log('has_updated', self.products)
  //   self.trigger('has_updated', self.products)
  // })
}
RiotControl.addStore(new ModelStore());


var FeatherClientMixin = {
    observable: riot.observable(),
    init: function(){
        var self = this;

        self.socket = io(self.opts.endpoint || 'http://localhost:3030');
        self.client = feathers()
          .configure(feathers.hooks())
          .configure(feathers.socketio(self.socket));

        if(typeof self.opts.service != 'undefined') {


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
                                riot.route([self.opts.service, 'list'].join('/'))
                            })
                            .catch(function(error){
                                console.error('SERVICEMIXIN DELETE ERROR', error);
                            });
            });


            self.eventKeyEditSave = self.opts.service + '_edit_save';
            RiotControl.on(self.eventKeyEditSave, () => {
                var data = self.getData();
                if(data == false) {
                    return false;
                }

                self.service.update(data.id,data)
                            .then(function(result){})
                            .catch(function(error){
                                console.error('Error CRUD-JSONEDITOR saveJSONEditor update', error);
                            });

            });

            self.eventKeyCreateSave = self.opts.service + '_create_save';
            RiotControl.on(self.eventKeyCreateSave, () => {
                var data = self.getData();
                if(data == false) {
                    return false;
                }

                self.service.create(data)
                            .then(function(result){})
                            .catch(function(error){
                                console.error('CRUD-JSONEDITOR error', data, error);
                            });
            });

            self.on('unmount', () => {
                RiotControl.off(self.eventKeyDelete);
                RiotControl.off(self.eventKeyDeleteConfirmation);
                RiotControl.off(self.eventKeyEditSave);
                RiotControl.off(self.eventKeyCreateSave);
            })

        }
        console.error('FeatherClientMixin',self.opts.service)
    }
}
riot.mixin("FeatherClientMixin", FeatherClientMixin);

var viewActionsMixin = {
    observable: riot.observable(),
    init: function(){
        var self = this;

        var actions = [
            {
              name: 'view',
              label: 'View',
              buttonClass: 'info',
              active: true
            },
            {
              name: 'edit',
              label: 'Edit',
              buttonClass: 'primary',
              active: true
            },
            {
              name: 'create',
              label: 'Create',
              buttonClass: 'warning',
              active: true
            },
            {
              name: 'delete',
              label: 'Delete',
              buttonClass: 'danger',
              active: true
            },
            {
              name: 'save',
              label: 'Save',
              buttonClass: 'success',
              active: true
            },
            {
              name: 'list',
              label: 'List',
              buttonClass: 'default',
              active: true
            }
        ];

        self.on('update', () => {

            var  view = self.opts.view || 'undefined';
            self.opts.actions = actions.map((action, index) => {
                action.active = true;
                switch(view) {
                    case 'view':
                        if(['view','save'].indexOf(action.name) != -1){
                            action.active = false;
                        }
                        break;
                    case 'edit':
                        if(['edit'].indexOf(action.name) != -1){
                            action.active = false;
                        }
                        break;
                    case 'create':
                        if(['create','edit','view','delete'].indexOf(action.name) != -1){
                            action.active = false;
                        }
                        break;
                    default:
                        break;

                }
                return action;
            });
        })

        self.click = (e) => {

            e.preventDefault();

            var service = self.opts.name;
            var view = self.opts.view;
            var action = e.item.action.name;
            var viewModelKey = [service, view, action].join('_');
            console.log('viewActionsMixin.click:' + viewModelKey);

            switch(action){
                case 'delete':
                    RiotControl.trigger(viewModelKey+'_confirmation')
                    break;
                case 'save':
                case 'update':
                    RiotControl.trigger(viewModelKey)
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
                    console.error('unknown event: ' + viewModelKey)
                    break;
            }

        }
    },

};
// register the ViewActionsMixin throughout the app
riot.mixin("viewActionsMixin", viewActionsMixin);
