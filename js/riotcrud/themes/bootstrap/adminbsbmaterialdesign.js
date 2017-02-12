riot.tag2('layout', '<section class="content"> <div class="container-fluid"> <div class="block-header"> <h2>DASHBOARD</h2> </div> <div class="row clearfix"> <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12"> <div class="info-box bg-pink hover-expand-effect"> <div class="icon"> <i class="material-icons">playlist_add_check</i> </div> <div class="content"> <div class="text">NEW TASKS</div> <div class="number count-to" data-from="0" data-to="125" data-speed="15" data-fresh-interval="20"></div> </div> </div> </div> <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12"> <div class="info-box bg-cyan hover-expand-effect"> <div class="icon"> <i class="material-icons">help</i> </div> <div class="content"> <div class="text">NEW TICKETS</div> <div class="number count-to" data-from="0" data-to="257" data-speed="1000" data-fresh-interval="20"></div> </div> </div> </div> <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12"> <div class="info-box bg-light-green hover-expand-effect"> <div class="icon"> <i class="material-icons">forum</i> </div> <div class="content"> <div class="text">NEW COMMENTS</div> <div class="number count-to" data-from="0" data-to="243" data-speed="1000" data-fresh-interval="20"></div> </div> </div> </div> <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12"> <div class="info-box bg-orange hover-expand-effect"> <div class="icon"> <i class="material-icons">person_add</i> </div> <div class="content"> <div class="text">NEW VISITORS</div> <div class="number count-to" data-from="0" data-to="1225" data-speed="1000" data-fresh-interval="20"></div> </div> </div> </div> </div> <div class="row clearfix"> <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"> <div class="card"> <div class="header"> <h2>CPU USAGE (%)</h2> <div class="pull-right"> <div class="switch panel-switch-btn"> <span class="m-r-10 font-12">REAL TIME</span> <label>OFF<input type="checkbox" id="realtime" checked><span class="lever switch-col-cyan"></span>ON</label> </div> </div> <ul class="header-dropdown m-r--5"> <li class="dropdown"> <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_vert</i> </a> <ul class="dropdown-menu pull-right"> <li><a href="javascript:void(0);">Action</a></li> <li><a href="javascript:void(0);">Another action</a></li> <li><a href="javascript:void(0);">Something else here</a></li> </ul> </li> </ul> </div> <div class="body"> <div id="real_time_chart" class="dashboard-flot-chart"></div> </div> </div> </div> </div> <div class="row clearfix"> <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4"> <div class="card"> <div class="body bg-pink"> <div class="sparkline" data-type="line" data-spot-radius="4" data-highlight-spot-color="rgb(233, 30, 99)" data-highlight-line-color="#fff" data-min-spot-color="rgb(255,255,255)" data-max-spot-color="rgb(255,255,255)" data-spot-color="rgb(255,255,255)" data-offset="90" data-width="100%" data-height="92px" data-line-width="2" data-line-color="rgba(255,255,255,0.7)" data-fill-color="rgba(0, 188, 212, 0)"> 12,10,9,6,5,6,10,5,7,5,12,13,7,12,11 </div> <ul class="dashboard-stat-list"> <li> TODAY <span class="pull-right"><b>1 200</b> <small>USERS</small></span> </li> <li> YESTERDAY <span class="pull-right"><b>3 872</b> <small>USERS</small></span> </li> <li> LAST WEEK <span class="pull-right"><b>26 582</b> <small>USERS</small></span> </li> </ul> </div> </div> </div> <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4"> <div class="card"> <div class="body bg-cyan"> <div class="m-b--35 font-bold">LATEST SOCIAL TRENDS</div> <ul class="dashboard-stat-list"> <li> #socialtrends <span class="pull-right"> <i class="material-icons">trending_up</i> </span> </li> <li> #materialdesign <span class="pull-right"> <i class="material-icons">trending_up</i> </span> </li> <li>#adminbsb</li> <li>#freeadmintemplate</li> <li>#bootstraptemplate</li> <li> #freehtmltemplate <span class="pull-right"> <i class="material-icons">trending_up</i> </span> </li> </ul> </div> </div> </div> <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4"> <div class="card"> <div class="body bg-teal"> <div class="font-bold m-b--35">ANSWERED TICKETS</div> <ul class="dashboard-stat-list"> <li> TODAY <span class="pull-right"><b>12</b> <small>TICKETS</small></span> </li> <li> YESTERDAY <span class="pull-right"><b>15</b> <small>TICKETS</small></span> </li> <li> LAST WEEK <span class="pull-right"><b>90</b> <small>TICKETS</small></span> </li> <li> LAST MONTH <span class="pull-right"><b>342</b> <small>TICKETS</small></span> </li> <li> LAST YEAR <span class="pull-right"><b>4 225</b> <small>TICKETS</small></span> </li> <li> ALL <span class="pull-right"><b>8 752</b> <small>TICKETS</small></span> </li> </ul> </div> </div> </div> </div> <div class="row clearfix"> <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8"> <div class="card"> <div class="header"> <h2>TASK INFOS</h2> <ul class="header-dropdown m-r--5"> <li class="dropdown"> <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_vert</i> </a> <ul class="dropdown-menu pull-right"> <li><a href="javascript:void(0);">Action</a></li> <li><a href="javascript:void(0);">Another action</a></li> <li><a href="javascript:void(0);">Something else here</a></li> </ul> </li> </ul> </div> <div class="body"> <div class="table-responsive"> <table class="table table-hover dashboard-task-infos"> <thead> <tr> <th>#</th> <th>Task</th> <th>Status</th> <th>Manager</th> <th>Progress</th> </tr> </thead> <tbody> <tr> <td>1</td> <td>Task A</td> <td><span class="label bg-green">Doing</span></td> <td>John Doe</td> <td> <div class="progress"> <div class="progress-bar bg-green" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" style="width: 62%"></div> </div> </td> </tr> <tr> <td>2</td> <td>Task B</td> <td><span class="label bg-blue">To Do</span></td> <td>John Doe</td> <td> <div class="progress"> <div class="progress-bar bg-blue" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%"></div> </div> </td> </tr> <tr> <td>3</td> <td>Task C</td> <td><span class="label bg-light-blue">On Hold</span></td> <td>John Doe</td> <td> <div class="progress"> <div class="progress-bar bg-light-blue" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100" style="width: 72%"></div> </div> </td> </tr> <tr> <td>4</td> <td>Task D</td> <td><span class="label bg-orange">Wait Approvel</span></td> <td>John Doe</td> <td> <div class="progress"> <div class="progress-bar bg-orange" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style="width: 95%"></div> </div> </td> </tr> <tr> <td>5</td> <td>Task E</td> <td> <span class="label bg-cyan">Suspended</span> </td> <td>John Doe</td> <td> <div class="progress"> <div class="progress-bar bg-cyan" role="progressbar" aria-valuenow="87" aria-valuemin="0" aria-valuemax="100" style="width: 87%"></div> </div> </td> </tr> </tbody> </table> </div> </div> </div> </div> <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4"> <div class="card"> <div class="header"> <h2>BROWSER USAGE</h2> <ul class="header-dropdown m-r--5"> <li class="dropdown"> <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> <i class="material-icons">more_vert</i> </a> <ul class="dropdown-menu pull-right"> <li><a href="javascript:void(0);">Action</a></li> <li><a href="javascript:void(0);">Another action</a></li> <li><a href="javascript:void(0);">Something else here</a></li> </ul> </li> </ul> </div> <div class="body"> <div id="donut_chart" class="dashboard-donut-chart"></div> </div> </div> </div> </div> </div> </section>', '', '', function(opts) {
});

riot.tag2('modal-delete-confirmation', '<div id="deleteConfirmation" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-sm"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel2">Delete <i>{opts.model}</i></h4> </div> <div class="modal-body"> id:{opts.id} {opts.text} </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Abbort</button> <button type="button" class="btn btn-warning" onclick="{confirm}">Delete</button> </div> </div> </div> </div>', '', '', function(opts) {
        var self = this;

         RiotControl.on('delete_confirmation_modal', (model, view, id, text) => {
            self.opts.model = model;
            self.opts.view = view;
            self.opts.id = id;
            self.opts.text = text || 'please confirm';
            self.update();
            $('#deleteConfirmation').modal('show');
        })

        this.confirm = function() {
            $('#deleteConfirmation').modal('hide');
            RiotControl.trigger([opts.model, opts.view, 'delete'].join('_'), opts.id);
        }.bind(this)

});

riot.tag2('top-menu', '<link href="/bower_components/gentelella/vendors/pnotify/dist/pnotify.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/pnotify/dist/pnotify.buttons.css" rel="stylesheet"> <link href="/bower_components/gentelella/vendors/pnotify/dist/pnotify.nonblock.css" rel="stylesheet"> <modal-delete-confirmation></modal-delete-confirmation>', '', '', function(opts) {
        var self = this;
        self.mixin(FeatherClientMixin);
        RiotCrudController.loadDependencies(
            [
                '/bower_components/gentelella/vendors/pnotify/dist/pnotify.js',
                '/bower_components/gentelella/vendors/pnotify/dist/pnotify.buttons.js',
                '/bower_components/gentelella/vendors/pnotify/dist/pnotify.nonblock.js',
            ],
            'top-menu',
            function (argument) {

                var services = Object.keys(self.opts.services);

                for(key in services) {

                    var service = services[key];

                    var events = self.opts.services[service];

                    for(event in events) {
                        var event = events[event];
                        self.event(service, event, function(service, event,response){
                            var eventTypeMap = {'created':'info', 'updated':'info','removed':'success'};
                            self.notify(
                                'Service "' + service + '" has been <i>' + event + '</i>'
                                , eventTypeMap[event] || event
                                ,'id: ' + (response.id || response._id)
                            );
                        })
                    }
                }
            }
        );

        RiotControl.on('notification', (title, type, text) => {
            this.notify(title, type, text);
        });

        this.on('mount', function(event) {});

        this.event = function(service, event, cb) {
            self[service] = self.client.service(service);
            self[service].on(event,function(response){
                cb(service, event, response);
            })
        }

        this.notify = function(title, type, text) {
            var stack_topleft = {"dir1": "down", "dir2": "right", "push": "top"};
            var stack_bottomleft = {"dir1": "right", "dir2": "up", "push": "top"};
            var stack_custom = {"dir1": "right", "dir2": "down"};
            var stack_custom2 = {"dir1": "left", "dir2": "up", "push": "top"};
            var stack_modal = {"dir1": "down", "dir2": "right", "push": "top", "modal": true, "overlay_close": true};
            var stack_bar_top = {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0};
            var stack_bar_bottom = {"dir1": "up", "dir2": "right", "spacing1": 0, "spacing2": 0};

            var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
            if(typeof PNotify == 'function')
            new PNotify({
                  delay: 13000,
                  title: title,

                  text: text || '',

                  newest_on_top: true,
                  addclass: 'bg-red ' + (self.color),

                  stack: stack_topleft
            });
        }

});




riot.tag2('side-menu', '<div class="navbar nav_title" style="border: 0;"> <a href="index.html" class="site_title"> <i class="fa fa-database"></i> <span>Riotjs crud admin</span> </a> </div> <div class="clearfix"></div> <div class="profile"> <div class="profile_pic"> <img src="/bower_components/gentelella/production/images/img.jpg" alt="..." class="img-circle profile_img"> </div> <div class="profile_info"> <span>Welcome,</span> <h2>John Doe</h2> </div> </div> <br> <br> <br> <div id="sidebar-menu" class="main_menu_side hidden-print main_menu"> <div class="menu_section"> <h3>Demos</h3> <ul class="nav side-menu"> <li each="{key,route in opts.routes.default.routes}"> <a href="#{route.route}" onclick="{routeTo}" style="" view="#{route.route}"><raw content="{route.title}"></raw></a> </li> <li each="{key,group in opts.routes}" if="{key!=\'default\'}"> <a if="{group.html}"> <raw content="{group.html}"></raw> </a> <ul if="{group.html}" class="nav child_menu"> <li each="{key,route in group.routes}" class="{selected: state}"> <a href="#{route.route}" onclick="{routeTo}" style="" view="#{route.route}"><raw content="{route.title}"></raw></a> </li> </ul> <a if="{!group.html}" each="{key,route in group.routes}" href="#{route.route}" onclick="{routeTo}" style="" view="#{route.route}"> <raw content="{route.title}"></raw> </a> </li> </ul> </div> </div> <div class="sidebar-footer hidden-small"> <a data-toggle="tooltip" data-placement="top" title="Settings"> <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> </a> <a data-toggle="tooltip" data-placement="top" title="FullScreen"> <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span> </a> <a data-toggle="tooltip" data-placement="top" title="Lock"> <span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> </a> <a data-toggle="tooltip" data-placement="top" title="Logout"> <span class="glyphicon glyphicon-off" aria-hidden="true"></span> </a> </div>', '', '', function(opts) {
        var self = this;

        RiotControl.on('routeStateChange',(route) => {
            var $current = $('.sidebar-menu').find('li.active > a.active');
            if($current.attr('href') == '#'+route) {
                $current.addClass('active');
            } else {
                $current.addClass('active');
            }
        });

        this.on('mount', function() {
          this.initSidebar();
        });

        this.routeTo = function(e) {
            route(e.item.route.route || e.item.route.view);
        }

        this.initSidebar = function() {
            var CURRENT_URL = window.location.href.split('?')[0],
            $BODY = $('body'),
            $MENU_TOGGLE = $('#menu_toggle'),
            $SIDEBAR_MENU = $('#sidebar-menu'),
            $SIDEBAR_FOOTER = $('.sidebar-footer'),
            $LEFT_COL = $('.left_col'),
            $RIGHT_COL = $('.right_col'),
            $NAV_MENU = $('.nav_menu'),
            $FOOTER = $('footer');

              var setContentHeight = function () {

                  $RIGHT_COL.css('min-height', $(window).height());

                  var bodyHeight = $BODY.outerHeight(),
                      footerHeight = $BODY.hasClass('footer_fixed') ? 0 : $FOOTER.height(),
                      leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
                      contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

                  contentHeight -= $NAV_MENU.height() + footerHeight;

                  $RIGHT_COL.css('min-height', contentHeight);
              };

              $SIDEBAR_MENU.find('a').on('click', function(ev) {
                  var $li = $(this).parent();
                  if ($li.is('.active')) {
                      $li.removeClass('active active-sm');
                      $('ul:first', $li).slideUp(function() {
                          setContentHeight();
                      });
                  } else {

                      if (!$li.parent().is('.child_menu')) {
                          $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                          $SIDEBAR_MENU.find('li ul').slideUp();
                      }

                      $li.addClass('active');

                      $('ul:first', $li).slideDown(function() {
                          setContentHeight();
                      });
                  }
              });

              $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

              $SIDEBAR_MENU.find('a').filter(function () {
                  return this.href == CURRENT_URL;
              }).parent('li').addClass('current-page').parents('ul').slideDown(function() {
                  setContentHeight();
              }).parent().addClass('active');

              $(window).smartresize(function(){
                  setContentHeight();
              });

              setContentHeight();

              if ($.fn.mCustomScrollbar) {
                  $('.menu_fixed').mCustomScrollbar({
                      autoHideScrollbar: true,
                      theme: 'minimal',
                      mouseWheel:{ preventDefault: true }
                  });
              }

        }
});