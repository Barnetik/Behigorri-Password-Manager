<div class="row">
    <div class="col-md-4 col-md-offset-4">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Please sign in</h3>
            </div>
            <div class="panel-body">
                {{ Form::open(array('method' => 'post')) }}
                    <fieldset>
                        <div class="form-group">
                            <input class="form-control" placeholder="Username" name="username" type="text" autofocus="true">
                        </div>

                        <div class="form-group">
                            <input class="form-control" placeholder="Password" name="password" type="password" value="">
                        </div>

                        <input class="btn btn-lg btn-success btn-block" type="submit" value="Login">
                    </fieldset>
                {{ Form::close() }}
            </div>
        </div>
    </div>
</div>