import { createTheme, localStorageColorSchemeManager } from '@mantine/core';

export const colorSchemeStorageKey = 'theme';

export const colorSchemeManager = localStorageColorSchemeManager({
  key: colorSchemeStorageKey,
});

const colors = Array.from({ length: 10 }, (_, index) => `var(--mantine-color-theme-${index})`);

const theme = createTheme({
  fontFamily: 'Instrument Sans, ui-sans-serif, system-ui, sans-serif',
  colors: {
    theme: colors,
  },
  primaryColor: 'theme',
  defaultRadius: 'sm',
});

export default theme;
