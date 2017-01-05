<top-widget>

    <div class="tile-stats">
      <div class="icon"><i class="fa {opts.icon}"></i></div>
      <div class="count">{opts.count}</div>
      <h3>{opts.title}</h3>
      <p>
        <a href="#{opts.service}/list" class="btn btn-xs pull-right"><i class="fa fa-list-ul"></i> show list</a>
    </p>

    </div>

  <script>
    var self = this;
    self.mixin(FeatherClientMixin);

    this.on('mount', () => {
        self.getData();
    });

    RiotControl.on('updateWidget'+opts.service, () => {
        self.getData();
    });

    self.getData = () => {
        if(typeof opts.service != 'undefined')
        self.client.service(opts.service)
                    .find({query:{$sort:{id:-1}}})
                    .then((result) => {
                            self.opts.count = result.total;
                            self.update();
                    })
                    .catch((error) => {console.error('Error Dashboard FIND', error);});
    }




  </script>
</top-widget>


<dashboard>

    <link href="/bower_components/gentelella/vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet">

    <div class="">

        <div class="row top_tiles">

            <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <top-widget title="Orders" description="Lorem ipsum psdea itgum rixt." icon="fa-euro" service="orders"></top-widget>
            </div>
            <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <top-widget title="Categories" description="Lorem ipsum psdea itgum rixt." icon="fa-sitemap" service="categories"></top-widget>
            </div>
            <div class="animated flipInY col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <top-widget title="Products" description="Lorem ipsum psdea itgum rixt." icon="fa-caret-square-o-right" service="products"></top-widget>
            </div>

        </div>

    </div>

    <script>
        var self = this;
        self.mixin(FeatherClientMixin);

        self.dependencies = [
        ];

        this.on('mount', function() {
             RiotCrudController.loadDependencies(self.dependencies,'crud-jsoneditor', function (argument) {
                setTimeout(this.fakeOrder, 3000);
                self.autoOrder = setInterval(this.fakeOrder, 8000);
            });
        });

        this.on('before-unmount', function() {
            clearTimeout(self.autoOrder);
        });

        fakeOrder = () => {
            self.client.service('orders')
                .find({query:{$sort:{id:-1},$limit:1}})
                .then((result) => {
                        var order = result.data[0];
                        order.id = result.total;
                        self.client.service('orders')
                            .create(order)
                            .then((result) => {
                                RiotControl.trigger('updateWidgetorders');
                            })
                            .catch((error) => {console.error('Error Dashboard create', error);});
                })
                .catch((error) => {console.error('Error Dashboard finde', error);});
        }

    </script>
</dashboard>


