<side-menu>

    <button class="close-button" aria-label="Close menu" type="button" data-close="">
        <span aria-hidden="true">×</span>
    </button>



    <ul class="mobile-ofc vertical menu">
        <li class="title">Riotjs CRUD</li>
        <li>
            <ul class="menu vertical submenu" data-submenu>
                <li each={route in routes} class={ selected: state }>
                    <a onclick="{ routeTo }" style="" view="{ route.view }"><raw content="{ route.name }" /></a>
                </li>
            </ul>
        </li>
        <li><a href="#product/show/345?test=1&filter=2" style="">Product <small>custom view</small><span class="state" show={ state }>ACTIVE</span></a></li>
        <li><a href="https://bitbucket.org/riotfoundation/riot-crud" class="button">code on bitbucket</a></li>

        <li><a class="alert" href="/?theme=bootstrap" class="button">Bootstrap version</a></li>
        <li><a class="alert" href="/?theme=zurb" class="button">Zurb Founation version</a></li>
    </ul>

	<script>
        this.on('updated', function(){
            $(document).foundation();
        })
        this.routes = opts.routes;
		var thisTag = this;
		thisTag.chosenTagName = "";

        this.routeTo = function(e) {
            console.log(e.item)
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

	</script>
</side-menu>

<side-menu-right>

</side-menu-right>