
var serviceMixin = {
    observable: riot.observable(),
    init: function(){
        var self = this;
        var socket = io(self.opts.endpoint);
        var client = feathers()
          .configure(feathers.hooks())
          .configure(feathers.socketio(socket));
        self.service = client.service(self.opts.modelname);
        console.info('SERVICE MIXIN INIT',self.opts.modelname, self.opts.endpoint, self.service);

    },

    refresh: function(opts) {
        console.log(opts);
        alert('refresch', opts.modelname)
    }
};


