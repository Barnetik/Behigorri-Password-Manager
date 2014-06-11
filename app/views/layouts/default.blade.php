<html>
    <link rel="stylesheet" type="text/css" href="{{ asset('bower_components/bootstrap/dist/css/bootstrap.min.css') }}" />
    <body>
        @section('sidebar')
            This is the master sidebar.
        @show

        <div class="container">
            {{ $content }}
        </div>

    </body>
</html>