<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @php($theme = app(\App\Support\ThemeManager::class)->active())
        <script>
            try {
                const storedColorScheme = window.localStorage.getItem('theme');
                const colorScheme = ['light', 'dark', 'auto'].includes(storedColorScheme) ? storedColorScheme : 'auto';
                const computedColorScheme = colorScheme !== 'auto'
                    ? colorScheme
                    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const colors = @json($theme['colors']);

                document.documentElement.setAttribute('data-mantine-color-scheme', computedColorScheme);
                colors.forEach((color, index) => {
                    document.documentElement.style.setProperty(`--mantine-color-theme-${index}`, color);
                });
            } catch (error) {
                document.documentElement.setAttribute('data-mantine-color-scheme', 'light');
            }
        </script>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        <x-inertia::head />
    </head>
    <body>
        <x-inertia::app />
    </body>
</html>
