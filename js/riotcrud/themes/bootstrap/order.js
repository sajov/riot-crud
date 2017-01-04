riot.tag2('order', '<div class=""> <div class="page-title hidden-print"> <div class="title_left"> <h3>Order {opts.data.orderId}</h3> </div> <div class="title_right"> <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search"> <div class="input-group"> <input type="text" class="form-control" placeholder="Search for..."> <span class="input-group-btn"> <button class="btn btn-default" type="button">Go!</button> </span> </div> </div> </div> </div> <div class="clearfix"></div> <div class="row"> <div class="col-md-12"> <div class="x_panel"> <div class="x_title hidden-print"> <h2>{opts.data.name} <small>{opts.data.address.city}</small></h2> <ul class="nav navbar-right panel_toolbox"> <li> <crud-action-menu name="{opts.name}" views="{opts.views}" view="{opts.view}" query="{opts.query}"></crud-action-menu> </li> <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a></li> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a> <ul class="dropdown-menu" role="menu"> <li> <a href="#">Settings 1</a> </li> <li> <a href="#">Settings 2</a> </li> </ul> </li> <li> <a class="close-link"><i class="fa fa-close"></i></a> </li> </ul> <div class="clearfix"></div> </div> <div class="x_content"> <section class="content invoice"> <div class="row"> <div class="col-xs-12 invoice-header"> <h1> <i class="fa fa-globe"></i> Order. <small class="pull-right">Date: {opts.data.createdAt}</small> </h1> </div> </div> <div class="row invoice-info"> <div class="col-sm-4 invoice-col"> From <address> <strong if="{opts.data.company.name}">{opts.data.company.name}</strong> <br if="{opts.data.company.name}"> <strong>{opts.data.name}</strong> <br>{opts.data.address.street} {opts.data.address.suite} <br>{opts.data.address.city}, {opts.data.address.zipcode} <br>Phone: {opts.data.phone} <br>Email: {opts.data.email} </address> </div> <div class="col-sm-4 invoice-col"> To <address> <strong>{opts.data.shippingAddress.name}</strong> <br>{opts.data.shippingAddress.street}, {opts.data.shippingAddress.suite} <br>{opts.data.shippingAddress.city}, {opts.data.shippingAddress.zipcode} <br>Phone: {opts.data.phone} <br>Email: {opts.data.email} </address> </div> <div class="col-sm-4 invoice-col"> <b>Invoice #007612</b> <br> <br> <b>Order ID:</b> {opts.data.orderId} <br> <b>Payment Due:</b> 2/22/2014 <br> <b>Account:</b> {opts.data.account} </div> </div> <div class="row"> <div class="col-xs-12 table"> <table class="table table-striped"> <thead> <tr> <th>SKU</th> <th>Product</th> <th>Image</th> <th style="width: 59%">Description</th> <th>Qty</th> <th>Subtotal</th> <th>&nbsp;</th> </tr> </thead> <tbody> <tr each="{item, key in opts.data.items}"> <td>{item.sku} </td> <td><img riot-src="{item.image}" width="60"></td> <td>{item.name}</td> <td>{item.description}</td> <td> <input type="text" name="qty" onchange="{changeQty}" value="{item.qty}" class="hidden-print" size="3"> <span class="visible-print">{item.qty}</span> </td> <td align="right">{item.price_euro} €</td> <td align="right"><a href="#" itemkey="{key}" onclick="{deleteItem}" class="btn btn-danger btn-xs hidden-print"><i class="fa fa-trash-o"></i></a></td> </tr> </tbody> </table> </div> </div> <div class="row"> <div class="col-xs-6"> <p class="lead">Payment Methods:</p> <img src="/bower_components/gentelella/production/images/visa.png" alt="Visa"> <img src="/bower_components/gentelella/production/images/mastercard.png" alt="Mastercard"> <img src="/bower_components/gentelella/production/images/american-express.png" alt="American Express"> <img src="/bower_components/gentelella/production/images/paypal2.png" alt="Paypal"> <p class="text-muted well well-sm no-shadow" style="margin-top: 10px;"> Etsy doostang zoodles disqus groupon greplin oooj voxy zoodles, weebly ning heekya handango imeem plugg dopplr jibjab, movity jajah plickers sifteo edmodo ifttt zimbra. </p> </div> <div class="col-xs-6"> <p class="lead">Amount Due 2/22/2014</p> <div class="table-responsive"> <table class="table"> <tbody> <tr> <th style="width:50%">Subtotal:</th> <td>{opts.data.subtotal} €</td> </tr> <tr ifno="{opts.data.discount}"> <th style="width:50%">Discount:</th> <td><input type="text" onkeyup="{changeDiscount}" name="discount" value="{opts.data.discount}" size="3"> €</td> </tr> <tr> <th>Tax ({opts.data.taxRate}%)</th> <td>{opts.data.tax} €</td> </tr> <tr> <th>Shipping:</th> <td><input type="text" onkeyup="{changeShipping}" name="discount" value="{opts.data.shipping}" size="3"> €</td> </tr> <tr> <th>Total:</th> <td>{opts.data.total} €</td> </tr> </tbody> </table> </div> </div> </div> <div class="row no-print hidden-print"> <div class="col-xs-12"> <button class="btn btn-default" onclick="window.print();"><i class="fa fa-print"></i> Print</button> <button class="btn btn-success pull-right"><i class="fa fa-credit-card"></i> Submit Payment</button> <button class="btn btn-primary pull-right" style="margin-right: 5px;"><i class="fa fa-download"></i> Generate PDF</button> </div> </div> </section> </div> </div> </div> </div> </div>', '', '', function(opts) {
        var self = this;
        self.mixin(FeatherClientMixin);

        self.on('mount', () => {
            console.info('order mount',self.opts);
            self.initOrder(self.opts.query.id);
        });

        self.refresh = (opts) => {
          self.initOrder(opts.query.id);
        }

        self.initOrder = (orderId) => {
          self.service.get(orderId).then((result) => {
                self.opts.data = result;
                self.update();
          }).catch((error) => {
            console.error('Error', error);
          });
        }

        self.calculate = () => {
            var subtotal = 0;
            for (key in opts.data.items) {
                subtotal += (opts.data.items[key].price_euro * opts.data.items[key].qty);
            }
            self.opts.data.subtotal = subtotal - opts.data.discount;
            self.opts.data.total = (self.opts.data.subtotal + self.opts.data.tax + self.opts.data.shipping)
            self.update();
        }

        this.changeQty = function (e) {
            e.preventDefault();
            for (var i = 0; i < opts.data.items.length; i++) {
                if(opts.data.items[i].id == e.item.item.id) {
                   opts.data.items[i].qty = $(e.target).val() * 1;
                }
            }
            self.calculate();
        }.bind(this)

        this.changeDiscount = function (e) {
            console.warn('changeDiscount: ' + $(e.target).val());
            e.preventDefault();
            opts.data.discount = $(e.target).val() * 1;
            self.calculate();
        }.bind(this)

        this.changeShipping = function (e) {
            console.warn('changeShipping: ' + $(e.target).val());
            e.preventDefault();
            opts.data.shipping = $(e.target).val() * 1;
            self.calculate();
        }.bind(this)

        this.deleteItem = function (e) {
            e.preventDefault();
            for (var i = 0; i < opts.data.items.length; i++) {
                if(opts.data.items[i].id == e.item.item.id) {
                   opts.data.items.splice(i, 1);
                }
            }
            self.calculate();
        }.bind(this)
});


