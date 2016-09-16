<register>
  <div class="row">
    <div class="medium-6 medium-centered large-4 large-centered columns">
        <form action="/signup" method="post">
            <div class="row column log-in-form">
                <h4 class="text-center">Register a new account</h4>
                <label>Email
                    <input type="text" name="email" placeholder="somebody@example.com">
                </label>
                <label>Password
                    <input type="{ opts.toggle.type }" name="password" placeholder="Password">
                </label>
                <input id="show-password" type="checkbox" checked="{ opts.toggle.checked }" onclick="{ toggle }">
                <label for="show-password">Show password</label>
                <p><button type="submit" class="button expanded">Register</button></p>
                <p class="text-center"><a href="#login">or Login</a></p>
            </div>
        </form>
    </div>
  </div>

  <script>
    opts.toggle = {
            checked: false,
            type: 'password',
        };
    this.on('mount', function() {
        if (!opts.toggle) opts.toggle = {
            checked: false,
            type: 'password',
        }

        console.log('mount register dsdfdfd');
        // notificationCenter.send('update_state',{name:'register'});
    });

    this.toggle = function() {
        opts.toggle.checked = !opts.toggle.checked
        // this.trigger('toggle', opts.toggle.checked)

        opts.toggle.type = opts.toggle.checked ? 'text' : 'password';
        this.update();
        console.log('check', opts.toggle)
    }
  </script>
</register>