import { createInertiaApp } from '@inertiajs/react';
import { MantineProvider } from '@mantine/core';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import theme, { colorSchemeManager } from './theme';

const progressColor = typeof document === 'undefined'
    ? '#2BDD66'
    : getComputedStyle(document.documentElement)
        .getPropertyValue('--mantine-color-theme-6')
        .trim() || '#2BDD66';

createInertiaApp({
    pages: {
        path: '../pages',
        extension: '.jsx',
        lazy: false,
    },
    withApp(app) {
        return (
            <MantineProvider
                colorSchemeManager={colorSchemeManager}
                defaultColorScheme="auto"
                theme={theme}
            >
                <ThemeToggle />
                {app}
            </MantineProvider>
        );
    },
    progress: {
        delay: 0,
        color: progressColor,
    }
});
