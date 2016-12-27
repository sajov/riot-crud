
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

    },

    refresh: function(opts) {
        console.log(opts);
        alert('refresch', opts.service)
    }
};


