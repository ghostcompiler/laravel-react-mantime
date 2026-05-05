# Laravel React Mantine

<p align="center">
  <img src="public/images/logo.png" alt="Laravel React Mantine Logo" width="180">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/PHP-8.3%2B-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0F172A" alt="React">
  <img src="https://img.shields.io/badge/Inertia-v3-9553E9?style=for-the-badge" alt="Inertia">
  <img src="https://img.shields.io/badge/Mantine-9-339AF0?style=for-the-badge" alt="Mantine">
  <img src="https://img.shields.io/badge/SSR-Ready-0F172A?style=for-the-badge" alt="SSR Ready">
</p>

<p align="center">
  <a href="https://github.com/ghostcompiler/laravel-react-mantime/actions/workflows/tests.yml">
    <img src="https://github.com/ghostcompiler/laravel-react-mantime/actions/workflows/tests.yml/badge.svg" alt="Tests">
  </a>
</p>

## Install

```bash
composer create-project ghostcompiler/laravel-react-mantime
```

```bash
laravel new demo --using=ghostcompiler/laravel-react-mantime
```

## Custom Artisan Makers

This project adds a few frontend-focused generator commands in `routes/console.php`.

### Pages

```bash
php artisan make:page Dashboard
```

Creates:

```text
resources/pages/Dashboard.jsx
```

Nested paths are supported:

```bash
php artisan make:page Admin/Users
```

Creates:

```text
resources/pages/Admin/Users.jsx
```

### Components

```bash
php artisan make:component ThemeToggle
```

Creates:

```text
resources/components/ThemeToggle.jsx
```

Nested paths are supported:

```bash
php artisan make:component Layouts/AppHeader
```

Creates:

```text
resources/components/Layouts/AppHeader.jsx
```

### Hooks

```bash
php artisan make:hook auth-user
```

Creates:

```text
resources/hooks/AuthUser.js
```

The generated function is normalized to a React hook name:

```js
export default function useAuthUser() {
    //
}
```

Nested paths are supported:

```bash
php artisan make:hook auth/use-user
```

Creates:

```text
resources/hooks/auth/UseUser.js
```

### Library Modules

```bash
php artisan make:lib formatter
```

Creates:

```text
resources/lib/Formatter.js
```

Nested paths are supported:

```bash
php artisan make:lib date/formatter
```

Creates:

```text
resources/lib/date/Formatter.js
```

### PHP Helpers

```bash
php artisan make:helper string-tools
```

Creates:

```text
app/helpers/StringTools.php
```

Nested paths are supported:

```bash
php artisan make:helper formatting/string-tools
```

Creates:

```text
app/helpers/formatting/StringTools.php
```

### Existing Files

If the target file already exists, the command asks before overwriting:

```text
resources/pages/Dashboard.jsx already exists. Overwrite it? (yes/no) [no]:
```

Use `--force` to overwrite without a prompt:

```bash
php artisan make:page Dashboard --force
```

## Mantine Theme

Mantine is configured in `resources/js/theme.js`.

The active color scheme is stored in browser local storage under:

```text
theme
```

Supported values are:

```text
light
dark
auto
```

The theme toggle is mounted globally from `resources/components/ThemeToggle.jsx`, so every Inertia page can switch between light, dark, and auto mode.

## Development And Build Environment

This starter was developed using **ServBay** as the local development environment.

### Development Tool Used

- Local development tool: `ServBay`
- Website: [www.servbay.com](https://www.servbay.com/)

### ServBay your development friend



### Testing And Build Machine

- Tested on: `Mac M4`
- Built on: `Mac M4`
