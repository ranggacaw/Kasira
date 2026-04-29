<!DOCTYPE html>
@php
    $themeColor = '#0f172a';

    if (\Illuminate\Support\Facades\Schema::hasTable('app_settings')) {
        $themeColor = \App\Models\AppSetting::current()->pwa_theme_color ?: $themeColor;
    }
@endphp
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Kasira') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=manrope:200,300,400,500,600,700,800&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.webmanifest">
        <meta name="theme-color" content="{{ $themeColor }}">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
