
var serviceMixin = {
    observable: riot.observable(),
    init: function(){
        var self = this;
        self.socket = io(self.opts.endpoint || 'http://localhost:3030');
        self.client = feathers()
          .configure(feathers.hooks())
          .configure(feathers.socketio(self.socket));

        if(typeof self.opts.service != 'undefined') {
            self.service = self.client.service(self.opts.service);
        }

        console.info('SERVICE MIXIN INIT',self.opts.service, self.opts.endpoint, self.service);

        self.delete = () => {
            if(self.data && self.data.id && self.service)
                self.service.remove(self.data.id ).then(function(result){
                    console.info('SERVICEMIXIN DELETE', result);
                }).catch(function(error){
                  console.error('SERVICEMIXIN DELETE ERROR', error);
                });

            if(self.opts.view != 'list') {
                riot.route(self.opts.name+'/list')
            } else {
                self.refresh();
            }
        }
    },

    refresh: function(opts) {
        console.log(opts);
        alert('refresch', opts.service)
    }
};

var SharedMixin = {
    observable: riot.observable(),
    init: function(opts){
        var self = this;
        self.called = false;
        self.caller = "";
        self.colors = ['red', 'blue', 'yellow'].filter(function(c){ return c != self.color})
        self.observable.on('event_call_' + self.color, function(caller){
            self.called = true;
            self.caller = caller;
            self.update();
            setTimeout(function(){ self.called = false; self.update(); },500);
        })
        self.click = function(e){
            self.observable.trigger('event_call_'+e.item.color,self.color);
        }
    }
};

var ViewActionsMixin = {
    observable: riot.observable(),
    init: function(){
        var self = this;

        console.log('opts!!!!!',self.opts)
        self.opts.actions = self.opts.actions.map((action, index)=>{
            var  view = self.opts.view || 'undefined';
            // if(view != 'view') {
            //   action.active = false;
            // }

            // if(view == 'create') {
            //   action.active = false;
            // }

            // if(view == 'view') {
            //   action.active = false;
            // }
            // if(view == 'edit') {
            //   action.active = true;
            // }

            // // if(view != 'view') {
            // //   action.active = false;
            // // }

            // if(view == 'view' || view == 'create') {
            //   action.active = false;
            // }
            return action;
        });

        self.observable.on('event_call_test', function(caller){
            console.log('caller',caller)
        })

        self.click = (e) => {
            e.preventDefault();
            console.log(self.opts.name,self.opts.view,self.opts.data.id,e.item);
            self.observable.trigger('event_call_test',e.item)
        }
    },

};

var ServiceActionsMixin = {
    observable: riot.observable(),
    init: function(opts){
        var self = this;
        console.info('ServiceObservableMixin opts', self.opts)
        self.observable.on('event_call_test', function(caller){
            console.log('caller',caller)
        })

        self.actionMenuTrigger = function(e){
            self.observable.trigger('event_call_test',e);
        }

        self.click = (e) => {
            e.preventDefault();
            console.log(e.item);
            self.observable.trigger('event_call_test',e.item)
        }
    },

};


