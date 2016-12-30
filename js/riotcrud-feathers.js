
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

var serviceObservableMixin = {
    observable: riot.observable(),
    init: (opts) => {
        var self = this;
        console.clear();
        console.log('serviceObservableMixin init');


        /**
         *  observable mapping model+action (? view)
         */
        // self.observable.on('*', (event) => {
        //     alert(event);
        // });

        self.observable.on('event_call_' + self.color, function(caller){
            self.called = true;
            self.caller = caller;
            self.update();
            setTimeout(function(){ self.called = false; self.update(); },500);
        })
        // self.observable.on(self.opts.service + '_save', () => {});

        // self.observable.on(self.opts.service + '_delete', () => {
        //     self.service.remove(self.getCurrentId())
        //         .then(function(result){})
        //         .catch(console.error);

        //     if(self.opts.view != 'list') {
        //         riot.route(self.opts.name+'/list')
        //     } else {
        //         self.refresh();
        //     }
        // });



    },

    actionMenuTrigger: (e) => {
        e.preventDefault();
        console.clear();
        console.log('actionMenuTrigger', e);
        riot.observable().trigger([e.item.service, e.item.view].join('_'), e.item.service, e.item.view, e.item.id)
    },

    // refresh: function(opts) {
    //     console.log(opts);
    //     alert('refresch', opts.service)
    // }
};


