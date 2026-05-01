<!DOCTYPE html>
@php
    $settings = null;
    $themeColor = '#0f172a';
    $appName = config('app.name', 'Kasira');
    $appShortName = 'Kasira';

    if (\Illuminate\Support\Facades\Schema::hasTable('app_settings')) {
        $settings = \App\Models\AppSetting::current();
        $themeColor = $settings->pwa_theme_color ?: $themeColor;
        $appName = $settings->pwa_name ?: $appName;
        $appShortName = $settings->pwa_short_name ?: $appShortName;
    }
@endphp
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

        <title inertia>{{ config('app.name', 'Kasira') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=manrope:200,300,400,500,600,700,800&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.webmanifest">
        <meta name="theme-color" content="{{ $themeColor }}">
        <meta name="application-name" content="{{ $appName }}">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-title" content="{{ $appShortName }}">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="format-detection" content="telephone=no">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="min-h-screen bg-surface font-sans antialiased text-on-surface">
        @inertia
    </body>
</html>
