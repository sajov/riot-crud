<dashboard>
    <div class="page-title">
        <div class="title_left">
            <h3>Dashboard <small> design</small></h3>
        </div>
       {opts.title}
        <div class="title_right">
            <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search for...">
                    <span class="input-group-btn">
                        <button class="btn btn-default" type="button">Go!</button>
                    </span>
                </div>
            </div>
        </div>
    </div>

    <div class="clearfix"></div>


    <script>
        var tag = this;

        this.on('before-mount', () => {
            console.info('dashboard before-mount', tag);
        });

        this.on('mount', function() {
            console.info('dashboard mount',tag.opts);
            // notificationCenter.send('update_state',{name:'dashboard'});
        });

        this.on('update', function() {
            console.info('dashboard update',tag.opts);
            // notificationCenter.send('update_state',{name:'dashboard'});
        });

        this.on('updated', function() {
            console.info('dashboard updated',tag.opts);
            // notificationCenter.send('update_state',{name:'dashboard'});
        });

        this.on('before-unmount', () => {
        })

        this.on('unmount', () => {
        })

        this.on('*', (eventName) => {
            console.info('dashboard all eventName:'+ eventName);
        })

    </script>
</dashboard>


