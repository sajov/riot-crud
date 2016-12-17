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
        var self = opts;
        this.on('mount', function() {
            alert('dashboard')
            console.log('mount dashboard',self);
            // notificationCenter.send('update_state',{name:'dashboard'});
        });

        this.on('update', function() {
            console.log('update dashboard',self);
            // notificationCenter.send('update_state',{name:'dashboard'});
        });

        this.on('updated', function() {
            console.log('updated dashboard',self);
            // notificationCenter.send('update_state',{name:'dashboard'});
        });

    </script>
</dashboard>


