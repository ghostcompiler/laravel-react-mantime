<?php

use App\Http\Controllers\ThemeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ThemeController::class, 'index'])->name('theme.index');
Route::post('/theme', [ThemeController::class, 'store'])->name('theme.store');
