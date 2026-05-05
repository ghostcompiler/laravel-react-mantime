<?php

namespace App\Http\Controllers;

use App\Support\ThemeManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class ThemeController extends Controller
{
    public function index(): Response
    {
        return inertia('welcome');
    }

    public function store(Request $request, ThemeManager $themes): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:40'],
            'base_color' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'colors' => ['required', 'array', 'size:10'],
            'colors.*' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'],
        ]);

        $themes->store($validated);

        return back();
    }
}
