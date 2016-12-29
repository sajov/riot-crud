riot.tag2('order', '<div class=""> <div class="page-title hidden-print"> <div class="title_left"> <h3>Order {opts.data.orderId}</h3> </div> <div class="title_right"> <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search"> <div class="input-group"> <input type="text" class="form-control" placeholder="Search for..."> <span class="input-group-btn"> <button class="btn btn-default" type="button">Go!</button> </span> </div> </div> </div> </div> <div class="clearfix"></div> <div class="row"> <div class="col-md-12"> <div class="x_panel"> <div class="x_title hidden-print"> <h2>{opts.data.name} <small>{opts.data.address.city}</small></h2> <ul class="nav navbar-right panel_toolbox"> <li> <crud-action-menu name="{opts.name}" views="{opts.views}" view="{opts.view}" data="{opts.query}"></crud-action-menu> </li> <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a> </li> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a> <ul class="dropdown-menu" role="menu"> <li><a href="#">Settings 1</a> </li> <li><a href="#">Settings 2</a> </li> </ul> </li> <li><a class="close-link"><i class="fa fa-close"></i></a> </li> </ul> <div class="clearfix"></div> </div> <div class="x_content"> <section class="content invoice"> <div class="row"> <div class="col-xs-12 invoice-header"> <h1> <i class="fa fa-globe"></i> Order. <small class="pull-right">Date: {opts.data.createdAt}</small> </h1> </div> </div> <div class="row invoice-info"> <div class="col-sm-4 invoice-col"> From <address> <strong if="{opts.data.company.name}">{opts.data.company.name}</strong> <br if="{opts.data.company.name}"> <strong>{opts.data.name}</strong> <br>{opts.data.address.street} {opts.data.address.suite} <br>{opts.data.address.city}, {opts.data.address.zipcode} <br>Phone: {opts.data.phone} <br>Email: {opts.data.email} </address> </div> <div class="col-sm-4 invoice-col"> To <address> <strong>{opts.data.shippingAddress.name}</strong> <br>{opts.data.shippingAddress.street}, {opts.data.shippingAddress.suite} <br>{opts.data.shippingAddress.city}, {opts.data.shippingAddress.zipcode} <br>Phone: {opts.data.phone} <br>Email: {opts.data.email} </address> </div> <div class="col-sm-4 invoice-col"> <b>Invoice #007612</b> <br> <br> <b>Order ID:</b> {opts.data.orderId} <br> <b>Payment Due:</b> 2/22/2014 <br> <b>Account:</b> {opts.data.account} </div> </div> <div class="row"> <div class="col-xs-12 table"> <table class="table table-striped"> <thead> <tr> <th>Qty</th> <th>Product</th> <th>Serial #</th> <th style="width: 59%">Description</th> <th>Subtotal</th> </tr> </thead> <tbody> <tr> <td>1</td> <td>Call of Duty</td> <td>455-981-221</td> <td>El snort testosterone trophy driving gloves handsome gerry Richardson helvetica tousled street art master testosterone trophy driving gloves handsome gerry Richardson </td> <td>$64.50</td> </tr> <tr> <td>1</td> <td>Need for Speed IV</td> <td>247-925-726</td> <td>Wes Anderson umami biodiesel</td> <td>$50.00</td> </tr> <tr> <td>1</td> <td>Monsters DVD</td> <td>735-845-642</td> <td>Terry Richardson helvetica tousled street art master, El snort testosterone trophy driving gloves handsome letterpress erry Richardson helvetica tousled</td> <td>$10.70</td> </tr> <tr> <td>1</td> <td>Grown Ups Blue Ray</td> <td>422-568-642</td> <td>Tousled lomo letterpress erry Richardson helvetica tousled street art master helvetica tousled street art master, El snort testosterone</td> <td>$25.99</td> </tr> </tbody> </table> </div> </div> <div class="row"> <div class="col-xs-6"> <p class="lead">Payment Methods:</p> <img src="/bower_components/gentelella/production/images/visa.png" alt="Visa"> <img src="/bower_components/gentelella/production/images/mastercard.png" alt="Mastercard"> <img src="/bower_components/gentelella/production/images/american-express.png" alt="American Express"> <img src="/bower_components/gentelella/production/images/paypal2.png" alt="Paypal"> <p class="text-muted well well-sm no-shadow" style="margin-top: 10px;"> Etsy doostang zoodles disqus groupon greplin oooj voxy zoodles, weebly ning heekya handango imeem plugg dopplr jibjab, movity jajah plickers sifteo edmodo ifttt zimbra. </p> </div> <div class="col-xs-6"> <p class="lead">Amount Due 2/22/2014</p> <div class="table-responsive"> <table class="table"> <tbody> <tr> <th style="width:50%">Subtotal:</th> <td>$250.30</td> </tr> <tr> <th>Tax (9.3%)</th> <td>$10.34</td> </tr> <tr> <th>Shipping:</th> <td>$5.80</td> </tr> <tr> <th>Total:</th> <td>$265.24</td> </tr> </tbody> </table> </div> </div> </div> <div class="row no-print hidden-print"> <div class="col-xs-12"> <button class="btn btn-default" onclick="window.print();"><i class="fa fa-print"></i> Print</button> <button class="btn btn-success pull-right"><i class="fa fa-credit-card"></i> Submit Payment</button> <button class="btn btn-primary pull-right" style="margin-right: 5px;"><i class="fa fa-download"></i> Generate PDF</button> </div> </div> </section> </div> </div> </div> </div> </div>', '', '', function(opts) {
        var self = this;
        self.mixin(serviceMixin);

        this.on('before-mount', () => {

        });

        this.on('mount', function() {
            console.info('order mount',self.opts);
            self.initOrder(self.opts.query.id);
        });

        this.on('update', function() {
            console.info('order update',self.opts);

        });

        this.on('updated', function() {
            console.info('order updated',self.opts);
        });

        this.on('before-unmount', () => {
        });

        this.on('unmount', () => {
        });

        this.delete = function(e) {
          e.preventDefault()
          alert('delete')
        };

        this.refresh = function(opts) {

          self.initOrder(opts.query.id);
        }

        this.initOrder = function(orderId) {
         console.info('order before-mount', orderId);
          self.service.get(orderId).then(function(result){
              console.info('CRUD-JSONEDITOR UPDATE FIND', result);
              self.opts.data = result;
              self.update();
          }).catch(function(error){
            console.error('Error CRUD-JSONEDITOR UPDATE FIND', error);
          });
        }
});


