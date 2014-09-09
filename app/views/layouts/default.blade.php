<!DOCTYPE html>
<html>
    <link rel="stylesheet" type="text/css" href="{{ asset('bower_components/bootstrap/dist/css/bootstrap.min.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('bower_components/jquery-file-upload/css/jquery.fileupload.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('bower_components/fontawesome/css/font-awesome.min.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('css/behigorri.css') }}" />
    <script type="text/javascript" src="{{ asset('bower_components/jquery/dist/jquery.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('bower_components/jquery-file-upload/js/vendor/jquery.ui.widget.js') }}"></script>
    <script type="text/javascript" src="{{ asset('bower_components/jquery-file-upload/js/jquery.iframe-transport.js') }}"></script>
    <script type="text/javascript" src="{{ asset('bower_components/jquery-file-upload/js/jquery.fileupload.js') }}"></script>
    <script type="text/javascript" src="{{ asset('bower_components/bootstrap/dist/js/bootstrap.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('bower_components/markdown/lib/markdown.js') }}"></script>
    @if (isset($scripts))
        @foreach ($scripts as $script)
            <script src="{{ asset($script) }}"></script>
        @endforeach
    @endif

    <base href="{{ URL::to('/') }}" />
    <body>

        <nav class="navbar navbar-default" role="navigation">
            <div class="container-fluid">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#">Behigorri PM</a>
                </div>

                @if (Auth::check())
                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    {{ Form::open(array('method' => 'get', 'class' => 'navbar-form navbar-left', 'role' => 'search'))}}
                        <div class="form-group">
                            {{ Form::input('text', 'query', $query, array('class' => 'form-control', 'placeholder' => 'Search'))}}
                        </div>
                        <button type="submit" class="btn btn-default">Submit</button>
                    {{ Form::close() }}
                    <ul class="nav navbar-nav navbar-right">
                        <li><span class="navbar-text">{{ Auth::user()->getAuthIdentifier() }}</span></li>
                        <li><a href="{{ URL::to('logout') }}">Logout</a></li>
                    </ul>
                </div><!-- /.navbar-collapse -->
                @endif
            </div><!-- /.container-fluid -->
        </nav>
        <div class="container">
            {{ $content }}
        </div>
    </body>
</html>