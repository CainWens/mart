<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Cain Wens</title>

    <!-- Scripts -->
    @vite(['resources/sass/app.scss', 'resources/js/app.js', 'resources/js/mart.js'])
</head>
<body class="bg-mart">
    <div id="app" class="min-h-svh w-full">
        @yield('content')
    </div>
</body>
</html>
