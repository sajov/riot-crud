riot.tag2('side-menu', '<div class="navbar nav_title" style="border: 0;"> <a href="index.html" class="site_title"> <i class="fa fa-database"></i> <span>Riotjs crud admin</span> </a> </div> <div class="clearfix"></div> <div class="profile"> <div class="profile_pic"> <img src="/bower_components/gentelella/production/images/img.jpg" alt="..." class="img-circle profile_img"> </div> <div class="profile_info"> <span>Welcome,</span> <h2>John Doe</h2> </div> </div> <br> <div id="sidebar-menu" class="main_menu_side hidden-print main_menu"> <div class="menu_section"> <h3>Demos</h3> <ul class="nav side-menu"> <li class="active"> <a> <i class="fa fa-edit"></i> Riotjs Tags native <span class="fa fa-chevron-down"></span> </a> <ul class="nav child_menu" style="display: block;"> <li><a href="index.html">Table</a></li> <li><a href="index.html">Show</a></li> <li><a href="index.html">Edit</a></li> <li><a href="index3.html">Create</a></li> </ul> <ul class="nav child_menu" style="display: block;"> <li> <a> Riotjs CRUD<span class="fa fa-chevron-down"></span> </a> <ul class="nav child_menu" style="display: block;"> <li each="{key,route in routes}" class="{selected: state}"> <a href="#/{route.route}" onclick="{routeTo}" style="" view="#/{route.route}"><raw content="{route.title}"></raw></a> </li> </ul> <small>this menu part ist auto generated</small> </li> <li class="title"> <a> Riotjs CRUD <small>(custom views)</small><span class="fa fa-chevron-down"></span> </a> <ul class="nav child_menu" style="display: block;"> <li><a href="#product/list" style="">Product <small>list</small><span class="state" show="{state}">ACTIVE</span></a></li> <li><a href="#product/show/345?test=1&filter=2" style="">Product <small>custom view</small><span class="state" show="{state}">ACTIVE</span></a></li> </ul> </li> <li><a href="#product/show/345?test=1&filter=2" style="">Product <small>custom view</small><span class="state" show="{state}">ACTIVE</span></a></li> </ul> </li> <li class="active"> <a> <i class="fa fa-edit"></i> Riotjs Tags with Pugins <span class="fa fa-chevron-down"></span> </a> <ul class="nav child_menu" style="display: block;"> <li><a href="index2.html">Datatables</a></li> <li><a href="index3.html">Json-Editor</a></li> <li><a href="index3.html">josdejong/jsoneditor</a></li> </ul> </li> <li> <a> <i class="fa fa-desktop"></i> Documentation <span class="fa fa-chevron-down"></span> </a> <ul class="nav child_menu"> <li><a href="calendar.html">Calendar</a></li> </ul> </li> </ul> </div> </div> <div class="sidebar-footer hidden-small"> <a data-toggle="tooltip" data-placement="top" title="Settings"> <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> </a> <a data-toggle="tooltip" data-placement="top" title="FullScreen"> <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span> </a> <a data-toggle="tooltip" data-placement="top" title="Lock"> <span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> </a> <a data-toggle="tooltip" data-placement="top" title="Logout"> <span class="glyphicon glyphicon-off" aria-hidden="true"></span> </a> </div>', '', '', function(opts) {
    this.routes = opts.routes;

    console.info('Menu this.routes',this.routes);
		var thisTag = this;
		thisTag.chosenTagName = "";

    this.routeTo = function(e) {
        console.log(e.item)
        alert(e.item.route.route);
        riot.route(e.item.route.view || e.item.route.route);
    }

    this.mountPage = function(page) {
        riot.route(page.route);
        riot.mount('#content',page.route);
    }

    thisTag.deselectAll = function() {
        routes.forEach(function(choice) {
            console.log(choice);
            choice[2] = false;
        });
    }

});

