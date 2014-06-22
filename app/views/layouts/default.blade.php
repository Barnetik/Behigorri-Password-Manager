<html>
    <link rel="stylesheet" type="text/css" href="{{ asset('bower_components/bootstrap/dist/css/bootstrap.min.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('bower_components/bootstrap/dist/css/bootstrap-theme.min.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('css/behigorri.css') }}" />
    <script type="text/javascript" src="{{ asset('bower_components/jquery/dist/jquery.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('bower_components/bootstrap/dist/js/bootstrap.min.js') }}"></script>
    @if (isset($scripts))
        @foreach ($scripts as $script)
            <script src="{{ asset($script) }}"></script>
        @endforeach
    @endif
    
    <base href="{{ URL::to('/') }}" />
    <body>
        @section('sidebar')
            This is the master sidebar.
        @show

        <div class="container">
            {{ $content }}
        </div>

    </body>
</html>