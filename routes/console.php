<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

$makeFile = function (string $basePath, string $name, string $extension, callable $stub, bool $force = false, ?callable $confirmOverwrite = null): ?string {
    $name = trim($name, '/\\');
    $name = preg_replace('/\s+/', '', $name) ?: 'Index';
    $pathInfo = pathinfo(str_replace('\\', '/', $name));

    $directory = $pathInfo['dirname'] === '.'
        ? $basePath
        : $basePath.'/'.$pathInfo['dirname'];

    $fileName = Str::studly($pathInfo['filename']);
    $filePath = $directory.'/'.$fileName.'.'.$extension;

    if (File::exists($filePath) && ! $force) {
        if (! $confirmOverwrite || ! $confirmOverwrite($filePath)) {
            return null;
        }
    }

    File::ensureDirectoryExists($directory);
    File::put($filePath, $stub($fileName));

    return $filePath;
};

$relativePath = fn (string $filePath): string => Str::after($filePath, base_path().'/');

Artisan::command('make:page {name : The page name} {--force : Overwrite the page if it already exists}', function (string $name) use ($makeFile, $relativePath) {
    $filePath = $makeFile(resource_path('pages'), $name, 'jsx', function (string $componentName): string {
        return <<<JSX
export default function {$componentName}() {
    return (
        <div>
            {$componentName}
        </div>
    );
}

JSX;
    }, (bool) $this->option('force'), fn (string $filePath): bool => $this->confirm("{$filePath} already exists. Overwrite it?", false));

    if (! $filePath) {
        $this->warn('Page creation cancelled.');

        return 1;
    }

    $this->outputComponents()->info('Page ['.$relativePath($filePath).'] created successfully.');
})->purpose('Create a new React page in resources/pages');

Artisan::command('make:component {name : The component name} {--force : Overwrite the component if it already exists}', function (string $name) use ($makeFile, $relativePath) {
    $filePath = $makeFile(resource_path('components'), $name, 'jsx', function (string $componentName): string {
        return <<<JSX
export default function {$componentName}() {
    return (
        <div>
            {$componentName}
        </div>
    );
}

JSX;
    }, (bool) $this->option('force'), fn (string $filePath): bool => $this->confirm("{$filePath} already exists. Overwrite it?", false));

    if (! $filePath) {
        $this->warn('Component creation cancelled.');

        return 1;
    }

    $this->outputComponents()->info('Component ['.$relativePath($filePath).'] created successfully.');
})->purpose('Create a new React component in resources/components');

Artisan::command('make:hook {name : The hook name} {--force : Overwrite the hook if it already exists}', function (string $name) use ($makeFile, $relativePath) {
    $filePath = $makeFile(resource_path('hooks'), $name, 'js', function (string $hookName): string {
        $functionName = Str::startsWith($hookName, 'Use')
            ? 'use'.Str::after($hookName, 'Use')
            : 'use'.$hookName;

        return <<<JS
export default function {$functionName}() {
    //
}

JS;
    }, (bool) $this->option('force'), fn (string $filePath): bool => $this->confirm("{$filePath} already exists. Overwrite it?", false));

    if (! $filePath) {
        $this->warn('Hook creation cancelled.');

        return 1;
    }

    $this->outputComponents()->info('Hook ['.$relativePath($filePath).'] created successfully.');
})->purpose('Create a new React hook in resources/hooks');

Artisan::command('make:lib {name : The library module name} {--force : Overwrite the module if it already exists}', function (string $name) use ($makeFile, $relativePath) {
    $filePath = $makeFile(resource_path('lib'), $name, 'js', function (string $moduleName): string {
        $functionName = Str::camel($moduleName);

        return <<<JS
export function {$functionName}() {
    //
}

JS;
    }, (bool) $this->option('force'), fn (string $filePath): bool => $this->confirm("{$filePath} already exists. Overwrite it?", false));

    if (! $filePath) {
        $this->warn('Library module creation cancelled.');

        return 1;
    }

    $this->outputComponents()->info('Library module ['.$relativePath($filePath).'] created successfully.');
})->purpose('Create a new JavaScript module in resources/lib');

Artisan::command('make:helper {name : The helper file name} {--force : Overwrite the helper if it already exists}', function (string $name) use ($makeFile, $relativePath) {
    $filePath = $makeFile(app_path('helpers'), $name, 'php', function (string $helperName): string {
        $functionName = Str::snake($helperName);

        return <<<PHP
<?php

if (! function_exists('{$functionName}')) {
    function {$functionName}(): void
    {
        //
    }
}

PHP;
    }, (bool) $this->option('force'), fn (string $filePath): bool => $this->confirm("{$filePath} already exists. Overwrite it?", false));

    if (! $filePath) {
        $this->warn('Helper creation cancelled.');

        return 1;
    }

    $this->outputComponents()->info('Helper ['.$relativePath($filePath).'] created successfully.');
})->purpose('Create a new PHP helper in app/helpers');
