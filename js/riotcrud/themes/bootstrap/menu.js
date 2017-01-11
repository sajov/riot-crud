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
                  delay: 3000,
                  title: title,
                  type: type,
                  text: text || '',

                  styling: 'bootstrap3',

                  addclass: "stack-bottomright",
                  stack: stack_bottomright
            });
        }

});




riot.tag2('side-menu', '<div class="navbar nav_title" style="border: 0;"> <a href="index.html" class="site_title"> <i class="fa fa-database"></i> <span>Riotjs crud admin</span> </a> </div> <div class="clearfix"></div> <div class="profile"> <div class="profile_pic"> <img src="/bower_components/gentelella/production/images/img.jpg" alt="..." class="img-circle profile_img"> </div> <div class="profile_info"> <span>Welcome,</span> <h2>John Doe</h2> </div> </div> <br> <br> <br> <div id="sidebar-menu" class="main_menu_side hidden-print main_menu"> <div class="menu_section"> <h3>Demos</h3> <ul class="nav side-menu"> <li each="{key,route in opts.routes.default.routes}"> <a href="#{route.route}" onclick="{routeTo}" style="" view="#{route.route}"><raw content="{route.title}"></raw></a> </li> <li each="{key,group in opts.routes}" if="{key!=\'default\'}"> <a> <raw content="{group.html}"></raw> </a> <ul class="nav child_menu"> <li each="{key,route in group.routes}" class="{selected: state}"> <a href="#{route.route}" onclick="{routeTo}" style="" view="#{route.route}"><raw content="{route.title}"></raw></a> </li> </ul> </li> </ul> </div> </div> <div class="sidebar-footer hidden-small"> <a data-toggle="tooltip" data-placement="top" title="Settings"> <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> </a> <a data-toggle="tooltip" data-placement="top" title="FullScreen"> <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span> </a> <a data-toggle="tooltip" data-placement="top" title="Lock"> <span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> </a> <a data-toggle="tooltip" data-placement="top" title="Logout"> <span class="glyphicon glyphicon-off" aria-hidden="true"></span> </a> </div>', '', '', function(opts) {
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
            riot.route(e.item.route.route || e.item.route.view);
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