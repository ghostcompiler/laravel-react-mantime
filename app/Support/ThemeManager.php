<?php

namespace App\Support;

use App\Models\Theme;
use Illuminate\Support\Facades\Cache;

class ThemeManager
{
    public const CACHE_KEY = 'theme.active';

    public const DEFAULT = [
        'name' => 'Custom',
        'baseColor' => '#2bdd66',
        'colors' => [
            '#e6ffee',
            '#d3f9e0',
            '#a8f2c0',
            '#7aea9f',
            '#54e382',
            '#3bdf70',
            '#2bdd66',
            '#1bc455',
            '#0bae4a',
            '#00973c',
        ],
    ];

    public function active(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function (): array {
            $theme = Theme::query()->where('is_active', true)->first();

            if (! $theme) {
                $theme = Theme::query()->create([
                    'name' => self::DEFAULT['name'],
                    'base_color' => self::DEFAULT['baseColor'],
                    'colors' => self::DEFAULT['colors'],
                    'is_active' => true,
                ]);
            }

            return $this->format($theme);
        });
    }

    public function store(array $theme): array
    {
        Theme::query()->update(['is_active' => false]);

        $record = Theme::query()->create([
            'name' => $theme['name'],
            'base_color' => strtolower($theme['base_color']),
            'colors' => array_map('strtolower', $theme['colors']),
            'is_active' => true,
        ]);

        $active = $this->format($record);

        Cache::forever(self::CACHE_KEY, $active);

        return $active;
    }

    private function format(Theme $theme): array
    {
        return [
            'name' => $theme->name,
            'baseColor' => $theme->base_color,
            'colors' => $theme->colors,
        ];
    }
}
