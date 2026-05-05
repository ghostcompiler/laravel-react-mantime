<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    protected $fillable = [
        'name',
        'base_color',
        'colors',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'colors' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
