<modal-dialog>

    <div id="modal-dialog" class="modal fade bs-example-modal-{ opts.size || 'lg'}" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-{ opts.size || 'lg'}">
        <div class="modal-content">

          <yield/>

        </div>
      </div>
    </div>

    <script>

        this.on('mount', () => {
            RiotControl.on(opts.trigger, () => {
                $('#modal-dialog').modal('toggle');
            });
        });

        this.on('unmount', () => {
            RiotControl.off(opts.trigger);
        });


    </script>

</modal-dialog>

<order>

    <modal-dialog trigger="order_add_item_modal" trigger-submit="crud-table-trigger-selected">

        <div class="modal-header">
            <button type="button" class="close waves-effect" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
            <h4 class="modal-title" id="myModalLabel2">Add Product</h4>
        </div>


        <div class="modal-body">
            <crud-table title="crud-table" service="products" showheader="0" limit="3" skip="0" ups={table:'test'}>
                    <yield class="pull-right">
                        <div class="clearfix"></div>
                        <br>
                        <button type="button" class="btn btn-default  waves-effect" data-dismiss="modal"  onclick={abort}>Abbort</button>
                        <button type="button" class="btn btn-info waves-effect" onclick={triggerData} data-trigger="product_add_items">Add</button>
                    </yield>
            </crud-table>
        </div>
        <div class="modal-footer">
            <!-- <button type="button" class="btn btn-default" data-dismiss="modal"  onclick={abort}>Abbort</button>
            <button type="button" class="btn btn-warning" onclick={confirm}>Delete</button> -->
        </div>

    </modal-dialog>

    <div if={opts.data} class="card">
        <div class="header">
            <h2>Order {opts.data.orderId}<small>{opts.data.name}, {opts.data.address.city}</small></h2>
            <crud-header-dropdown if={opts.actionMenu !== false} service="{opts.service}" name="{opts.name}" views="{opts.views}" view="{opts.view}" query="{opts.query}" buttons="{opts.buttons}"></crud-header-dropdown>
        </div>
        <div class="body">
            <div class="">
                <div class="x_title hidden-print">
                    <span class="col-lg-12 text-right">Date: {opts.data.createdAt}</span>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <section class="invoice">
                        <!-- info row -->
                        <div class="row invoice-info">
                            <div class="col-lg-4 col-sm-6 col-xs-12 invoice-col">
                                From
                                <address>
                                    <strong if={opts.data.company.name}><a href="">{opts.data.company.name}</a></strong>
                                    <br if={opts.data.company.name}>
                                    <strong><a href="">{opts.data.name}</a></strong>
                                    <br><a href="">{opts.data.address.street}</a> {opts.data.address.suite}
                                    <br><a href="">{opts.data.address.city}</a>, {opts.data.address.zipcode}
                                    <br>Phone: {opts.data.phone}
                                    <br>Email: {opts.data.email}
                                </address>
                            </div>
                            <!-- /.col -->
                            <div class="col-lg-4 col-sm-6 col-xs-12 invoice-col">
                                To
                                <address>
                                    <strong>{opts.data.shippingAddress.name}</strong>
                                    <br>{opts.data.shippingAddress.street}, {opts.data.shippingAddress.suite}
                                    <br>{opts.data.shippingAddress.city}, {opts.data.shippingAddress.zipcode}
                                    <br>Phone: {opts.data.phone}
                                    <br>Email: {opts.data.email}
                                </address>
                            </div>
                            <!-- /.col -->
                            <div class="col-lg-4 col-sm-12 col-xs-12 invoice-col">
                                <b>Invoice #007612</b>
                                <br>
                                <br>
                                <b>Order ID:</b> {opts.data.orderId}
                                <br>
                                <b>Order Due:</b> {opts.data.createdAt}
                                <br>
                                <b>Payment Due:</b> 2/22/2014
                                <br>
                                <b>Account:</b> {opts.data.account}
                            </div>
                            <!-- /.col -->
                        </div>
                        <!-- /.row -->


                        <!-- ITEMS Table row  -->
                        <div class="row">
                            <div class="col-xs-12 table-responsive">
                            <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>SKU</th>
                                            <th>Product</th>
                                            <th>Image</th>
                                            <th style="width: 59%">Description</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                            <th>Subtotal</th>
                                            <th>&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr each={ item, key in opts.data.items }>
                                            <td>{item.sku} </td>
                                            <td><img src="{item.image}" width="60"></td>
                                            <td>{item.name}</td>
                                            <td>{item.description}</td>
                                            <td>
                                                <input type="text" name="qty" onchange={ changeQty } value="{item.qty}" class="hidden-print text-right" size="3">
                                                <span class="visible-print">{item.qty}</span>
                                            </td>
                                            <td align="right">{item.price_euro} €</td>
                                            <td align="right">{item.total} €</td>
                                            <td align="right"><a href="#" itemKey="{key}" onclick={ deleteItem } class="btn btn-danger btn-xs hidden-print">
                                                <i class="material-icons col-white">remove</i>
                                            </a></td>
                                        </tr>
                                        <tr>
                                            <td colspan="8">
                                                <button class="btn btn-primary pull-right hidden-print waves-effect" onclick={ addItemModal } ><i class="material-icons col-white">add</i></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!-- /.col -->
                        </div>
                        <!-- /.row -->


                        <div class="row">
                            <!-- TOTALS -->
                            <div class="col-xs-12 col-lg-4 pull-right">
                                <p class="lead">Amount Due 2/22/2014</p>
                                <div class="table-responsive">
                                    <table class="table">
                                         <tbody>
                                            <tr>
                                                <th style="width:50%">Subtotal:</th>
                                                <td align="right">{opts.data.subtotal} €</td>
                                            </tr>
                                            <tr ifNO="{opts.data.discount}">
                                                <th style="width:50%">Discount:</th>
                                                <td align="right"><input type="text" onkeyup={ changeDiscount } name="discount" value="{opts.data.discount}" class="text-right" size="10"> €</td>
                                            </tr>
                                            <tr>
                                                <th>Tax ({opts.data.taxRate}%)</th>
                                                <td align="right">{opts.data.tax} €</td>
                                            </tr>
                                            <tr>
                                                <th>Shipping:</th>
                                                <td align="right"><input type="text" onkeyup={ changeShipping } name="discount" value="{opts.data.shipping}" class="text-right" size="10"> €</td>
                                            </tr>
                                            <tr>
                                                <th>Total:</th>
                                                <td align="right">{opts.data.total} €</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <!-- /.col -->

                            <!-- accepted payments column -->
                            <div class="col-xs-12 col-lg-6 pull-left">
                                <p class="lead">Payment Methods:</p>
                                <img src="/bower_components/gentelella/production/images/visa.png" alt="Visa">
                                <img src="/bower_components/gentelella/production/images/mastercard.png" alt="Mastercard">
                                <img src="/bower_components/gentelella/production/images/american-express.png" alt="American Express">
                                <img src="/bower_components/gentelella/production/images/paypal2.png" alt="Paypal">
                                <p class="text-muted well well-sm no-shadow" style="margin-top: 10px;">
                                    Etsy doostang zoodles disqus groupon greplin oooj voxy zoodles, weebly ning heekya handango imeem plugg dopplr jibjab, movity jajah plickers sifteo edmodo ifttt zimbra.
                                </p>
                            </div>
                            <!-- /.col -->


                        </div>
                        <!-- /.row -->
                        <!-- this row will not appear when printing -->
                        <div class="row no-print hidden-print">
                            <div class="btn-group pull-right">
                                <button onclick={ save } class="btn btn-danger waves-effect">
                                    <i class="material-icons">save</i>
                                    <span>Save</span>
                                </button>
                                <button class="btn btn-success waves-effect">
                                    <i class="material-icons">payment</i>
                                    <span>Submit Payment</span>
                                </button>
                                <button class="btn btn-default waves-effect" onclick="window.print();">
                                    <i class="material-icons">print</i>
                                    <span>Print</span>
                                </button>
                                <button class="btn btn-primary waves-effect" style="margin-right: 5px;">
                                    <i class="material-icons">picture_as_pdf</i>
                                    Generate PDF
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>


    <link href="/bower_components/gentelella/vendors/iCheck/skins/flat/green.css" rel="stylesheet">
    <link href="/bower_components/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css" rel="stylesheet">

    <script>
        var self = this;
        self.debug = true;
        self.dependencies = [
            '/bower_components/gentelella/vendors/iCheck/icheck.min.js',
            '/bower_components/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.min.js'
        ];

        self.mixin('FeatherClientMixin');

        RiotControl.on('product_add_items', (items) => {
            if(items)
                self.addItems(items);
        });

        self.on('mount', () => {
            // RiotCrudController.loadDependencies(self.dependencies,'custom-order', function (argument) {
            //     console.info('order mount',self.opts.schema);
                if(self.opts.query.id)
                    self.initOrder(self.opts.query.id);
            // });


        });


        self.save = () => {
            RiotControl.trigger(opts.service + '_save');
        }

        self.refresh = (opts) => {
            if(opts.query.id)
                self.initOrder(opts.query.id);
        }

        self.initOrder = (orderId) => {
          self.service.get(orderId).then((result) => {
                self.opts.data = result;
                // RiotControl.trigger('order_add_item_modal', opts.id); // !!!
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

        self.getData = () => {
            console.warn('schema lölkjkljljlkjkljljkl',opts.schema);
            return opts.data;
        }

        changeQty (e) {
            e.preventDefault();
            for (var i = 0; i < opts.data.items.length; i++) {
                if(opts.data.items[i][opts.idfield] == e.item.item[opts.idfield]) {
                   opts.data.items[i].qty = $(e.target).val() * 1;
                   opts.data.items[i].total = opts.data.items[i].qty * opts.data.items[i].price_euro;
                }
            }
            self.calculate();
        }

        addItemModal () {
            // RiotControl.trigger('modal-add-item-show', opts.id);
            RiotControl.trigger('order_add_item_modal', opts.id);
        }

        addItems (items) {
            if(items.length > 0) {
                for (var i = 0; i < items.length; i++) {
                    items[i].qty = 1;
                    items[i].total = 1 * items[i].price_euro;
                    opts.data.items.push(items[i])
                }
                self.calculate();
                RiotControl.trigger('order_add_item_modal', opts.id);
            }
        }

        changeDiscount (e) {
            console.warn('changeDiscount: ' + $(e.target).val());
            e.preventDefault();
            opts.data.discount = $(e.target).val() * 1;
            self.calculate();
        }

        changeShipping (e) {
            console.warn('changeShipping: ' + $(e.target).val());
            e.preventDefault();
            opts.data.shipping = $(e.target).val() * 1;
            self.calculate();
        }

        deleteItem (e) {
            e.preventDefault();
            for (var i = 0; i < opts.data.items.length; i++) {
                if(opts.data.items[i][opts.idfield] == e.item.item[opts.idfield]) {
                   opts.data.items.splice(i, 1);
                }
            }
            self.calculate();
        }



    </script>
</order>


