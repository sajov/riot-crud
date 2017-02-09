<layout>
    <div class="container body">
      <div class="main_container">

        <div class="col-md-3 left_col">
          <div class="left_col scroll-view">
            <div id="side-menu"></div>
            <!-- <side-menu routes="{opts.routes}"></side-menu> -->
          </div>
        </div>

        <!-- top navigation -->
        <div class="top_nav hidden-print">
            <div class="nav_menu">
                <nav class="" role="navigation">
                    <div class="nav toggle">
                        <a id="menu_toggle"><i class="fa fa-bars"></i></a>
                    </div>
                    <ul class="nav navbar-nav navbar-right">
                        <li class="">
                            <a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                <img src="/bower_components/gentelella/production/images/img.jpg" alt="">John Doe
                                <span class=" fa fa-angle-down"></span>
                            </a>
                            <ul class="dropdown-menu dropdown-usermenu pull-right">
                                <li><a href="javascript:;"> Profile</a></li>
                                <li>
                                    <a href="javascript:;">
                                        <span class="badge bg-red pull-right">50%</span>
                                        <span>Settings</span>
                                    </a>
                                </li>
                                <li><a href="javascript:;">Help</a></li>
                                <li><a href="login.html"><i class="fa fa-sign-out pull-right"></i> Log Out</a></li>
                            </ul>
                        </li>
                        <li role="presentation" class="dropdown">
                            <!-- <top-menu></top-menu> -->
                            <div id="top-menu"></div>

                            <a href="javascript:;" class="dropdown-toggle info-number" data-toggle="dropdown" aria-expanded="false">
                                <i class="fa fa-envelope-o"></i>
                                <span class="badge bg-green">6</span>
                            </a>
                            <ul id="menu1" class="dropdown-menu list-unstyled msg_list" role="menu">
                                <li>
                                    <a>
                                        <span class="image"><img src="/bower_components/gentelella/production/images/img.jpg" alt="Profile Image"></span>
                                        <span>
                                            <span>John Smith</span>
                                            <span class="time">3 mins ago</span>
                                        </span>
                                        <span class="message">
                                            Film festivals used to be do-or-die moments for movie makers. They were where...
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a>
                                        <span class="image"><img src="/bower_components/gentelella/production/images/img.jpg" alt="Profile Image"></span>
                                        <span>
                                            <span>John Smith</span>
                                            <span class="time">3 mins ago</span>
                                        </span>
                                        <span class="message">
                                            Film festivals used to be do-or-die moments for movie makers. They were where...
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a>
                                        <span class="image"><img src="/bower_components/gentelella/production/images/img.jpg" alt="Profile Image"></span>
                                        <span>
                                            <span>John Smith</span>
                                            <span class="time">3 mins ago</span>
                                        </span>
                                        <span class="message">
                                            Film festivals used to be do-or-die moments for movie makers. They were where...
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a>
                                        <span class="image"><img src="/bower_components/gentelella/production/images/img.jpg" alt="Profile Image"></span>
                                        <span>
                                            <span>John Smith</span>
                                            <span class="time">3 mins ago</span>
                                        </span>
                                        <span class="message">
                                            Film festivals used to be do-or-die moments for movie makers. They were where...
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <div class="text-center">
                                        <a>
                                            <strong>See All Alerts</strong>
                                            <i class="fa fa-angle-right"></i>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <!-- /top navigation -->

         <!-- MAIN CONTENT -->
        <div class="right_col" role="main" style="min-height: 1744px;">
          <div id="content">

          </div>
        </div>
        <!-- footer content -->
        <footer>
          <div class="pull-right hidden-print">
            Gentelella - Bootstrap Admin Template by <a href="https://colorlib.com">Colorlib</a>
          </div>
          <div class="clearfix"></div>
        </footer>
        <!-- /footer content -->
      </div>
    </div>
</layout>

<modal-delete-confirmation>

    <!-- Small modal -->
    <div id="deleteConfirmation" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">

          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span>
            </button>
            <h4 class="modal-title" id="myModalLabel2">Delete <i>{opts.model}</i></h4>
          </div>
          <div class="modal-body">
            id:{opts.id} {opts.text}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Abbort</button>
            <button type="button" class="btn btn-warning" onclick="{confirm}">Delete</button>
          </div>

        </div>
      </div>
    </div>
    <!-- /modals -->

    <script>
        var self = this;

         RiotControl.on('delete_confirmation_modal', (model, view, id, text) => {
            self.opts.model = model;
            self.opts.view = view;
            self.opts.id = id;
            self.opts.text = text || 'please confirm';
            self.update();
            $('#deleteConfirmation').modal('show');
        })

        confirm() {
            $('#deleteConfirmation').modal('hide');
            RiotControl.trigger([opts.model, opts.view, 'delete'].join('_'), opts.id);
        }

    </script>

</modal-delete-confirmation>

<top-menu>

    <link href="/bower_components/gentelella/vendors/pnotify/dist/pnotify.css" rel="stylesheet">
    <link href="/bower_components/gentelella/vendors/pnotify/dist/pnotify.buttons.css" rel="stylesheet">
    <link href="/bower_components/gentelella/vendors/pnotify/dist/pnotify.nonblock.css" rel="stylesheet">
    <modal-delete-confirmation></modal-delete-confirmation>

    <script>
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
                    // self[service] = self.client.service(service);
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
            /*********** Positioned Stack ***********
            * This stack is initially positioned through code instead of CSS.
            * This is done through two extra variables. firstpos1 and firstpos2
            * are pixel values, relative to a viewport edge. dir1 and dir2,
            * respectively, determine which edge. It is calculated as follows:
            *
            * - dir = "up" - firstpos is relative to the bottom of viewport.
            * - dir = "down" - firstpos is relative to the top of viewport.
            * - dir = "right" - firstpos is relative to the left of viewport.
            * - dir = "left" - firstpos is relative to the right of viewport.
            */
            var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
            if(typeof PNotify == 'function')
            new PNotify({
                  delay: 3000,
                  title: title,
                  type: type,
                  text: text || '',
                  // nonblock: {
                  //     nonblock: true
                  // },
                  styling: 'bootstrap3',
                  // addclass: 'dark'
                  addclass: "stack-bottomright",
                  stack: stack_bottomright
            });
        }


    </script>

</top-menu>




<side-menu>

    <div class="navbar nav_title" style="border: 0;">
        <a href="index.html" class="site_title">
            <i class="fa fa-database"></i> <span>Riotjs crud admin</span>
        </a>
    </div>
    <div class="clearfix"></div>

    <!-- menu profile quick info -->
    <div class="profile">
        <div class="profile_pic">
            <img src="/bower_components/gentelella/production/images/img.jpg" alt="..." class="img-circle profile_img">
        </div>
        <div class="profile_info">
            <span>Welcome,</span>
            <h2>John Doe</h2>
        </div>
    </div>
    <!-- /menu profile quick info -->
    <br />
    <br />
    <br />

    <!-- sidebar menu -->
    <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
        <div class="menu_section">
          <h3>Demos</h3>
          <ul class="nav side-menu">

            <!-- default routes -->
            <li each={key,route in opts.routes.default.routes}>
                <a href="#{ route.route }" onclick="{ routeTo }" style="" view="#{ route.route }"><raw content="{ route.title }" /></a>
            </li>
            <!-- end default routes -->

            <!-- custom routes RiotControl.addMenuGroup() -->
            <li each={key,group in opts.routes} if={key!='default'}>
                <a if={group.html}>
                    <raw content="{group.html}" />
                </a>
                <ul if={group.html} class="nav child_menu">
                    <li each={key,route in group.routes} class={ selected: state }>
                         <a href="#{ route.route }" onclick="{ routeTo }" style="" view="#{ route.route }"><raw content="{ route.title }" /></a>
                    </li>
                </ul>
                <a if={!group.html} each={key,route in group.routes} href="#{ route.route }" onclick="{ routeTo }" style="" view="#{ route.route }">
                  <raw content="{ route.title }" />
                </a>
            </li>
            <!-- end custom routes RiotControl.addMenuGroup() -->

          </ul>
        </div>
    </div>
    <!-- /sidebar menu -->
    <!-- /menu footer buttons -->
    <div class="sidebar-footer hidden-small">
        <a data-toggle="tooltip" data-placement="top" title="Settings">
        <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
        </a>
        <a data-toggle="tooltip" data-placement="top" title="FullScreen">
        <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span>
        </a>
        <a data-toggle="tooltip" data-placement="top" title="Lock">
        <span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span>
        </a>
        <a data-toggle="tooltip" data-placement="top" title="Logout">
        <span class="glyphicon glyphicon-off" aria-hidden="true"></span>
        </a>
    </div>
    <!-- /menu footer buttons -->

    <script>
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
          // Sidebar
              // TODO: This is some kind of easy fix, maybe we can improve this
              var setContentHeight = function () {
                  // reset height
                  $RIGHT_COL.css('min-height', $(window).height());

                  var bodyHeight = $BODY.outerHeight(),
                      footerHeight = $BODY.hasClass('footer_fixed') ? 0 : $FOOTER.height(),
                      leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
                      contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

                  // normalize content
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
                      // prevent closing menu if we are on child menu
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

              // // toggle small or large menu
              // $MENU_TOGGLE.on('click', function() {
              //     if ($BODY.hasClass('nav-md')) {
              //         $SIDEBAR_MENU.find('li.active ul').hide();
              //         $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
              //     } else {
              //         $SIDEBAR_MENU.find('li.active-sm ul').show();
              //         $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
              //     }

              //     $BODY.toggleClass('nav-md nav-sm');

              //     setContentHeight();
              // });

              // check active menu
              $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

              $SIDEBAR_MENU.find('a').filter(function () {
                  return this.href == CURRENT_URL;
              }).parent('li').addClass('current-page').parents('ul').slideDown(function() {
                  setContentHeight();
              }).parent().addClass('active');

              // recompute content when resizing
              $(window).smartresize(function(){
                  setContentHeight();
              });

              setContentHeight();

              // fixed sidebar
              if ($.fn.mCustomScrollbar) {
                  $('.menu_fixed').mCustomScrollbar({
                      autoHideScrollbar: true,
                      theme: 'minimal',
                      mouseWheel:{ preventDefault: true }
                  });
              }
          // /Sidebar
        }
    </script>

</side-menu>