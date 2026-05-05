import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { generateColors } from '@mantine/colors-generator';
import {
    ActionIcon,
    Badge,
    Button,
    Checkbox,
    Code,
    ColorInput,
    CopyButton,
    Divider,
    Group,
    Paper,
    Progress,
    RingProgress,
    SegmentedControl,
    SimpleGrid,
    Stack,
    Switch,
    Tabs,
    Text,
    ThemeIcon,
    Title,
    Tooltip,
} from '@mantine/core';
import {
    ArrowRightIcon,
    ClipboardTextIcon,
    CodeIcon,
    CommandIcon,
    CubeIcon,
    DatabaseIcon,
    FileJsIcon,
    FunctionIcon,
    GitBranchIcon,
    RocketLaunchIcon,
    SparkleIcon,
} from '@phosphor-icons/react';
import classes from './welcome.module.css';

const installCommands = [
    {
        label: 'Composer',
        command: 'composer create-project ghostcompiler/laravel-react-mantime',
    },
    {
        label: 'Laravel installer',
        command: 'laravel new demo --using=ghostcompiler/laravel-react-mantime',
    },
];

const customCommands = [
    {
        icon: FileJsIcon,
        name: 'Page',
        command: 'php artisan make:page Dashboard',
        path: 'resources/pages/Dashboard.jsx',
    },
    {
        icon: CubeIcon,
        name: 'Component',
        command: 'php artisan make:component Layouts/AppHeader',
        path: 'resources/components/Layouts/AppHeader.jsx',
    },
    {
        icon: FunctionIcon,
        name: 'Hook',
        command: 'php artisan make:hook auth/use-user',
        path: 'resources/hooks/auth/UseUser.js',
    },
    {
        icon: CodeIcon,
        name: 'Lib',
        command: 'php artisan make:lib date/formatter',
        path: 'resources/lib/date/Formatter.js',
    },
    {
        icon: CommandIcon,
        name: 'Helper',
        command: 'php artisan make:helper formatting/string-tools',
        path: 'app/helpers/formatting/StringTools.php',
    },
];

const included = [
    {
        title: 'Laravel',
        body: 'Laravel 13 application structure, routes, controllers, models, migrations, cache-backed theme storage, and Artisan command extensions.',
        icon: RocketLaunchIcon,
    },
    {
        title: 'Inertia',
        body: 'Inertia v3 connects Laravel responses to React pages with shared props, instant visits, and server-driven routing.',
        icon: GitBranchIcon,
    },
    {
        title: 'Mantine',
        body: 'Mantine 9 is wired as the design system with theme color variables, components, color mode, and UI primitives ready to use.',
        icon: CubeIcon,
    },
    {
        title: 'SSR',
        body: 'Inertia SSR is configured with Vite SSR builds and client hydration so pages can render on the server when the SSR service is running.',
        icon: DatabaseIcon,
    },
];

const presets = [
    ['Blue gray', '#5474b4'],
    ['Brown', '#8a6f5a'],
    ['Tomato', '#ff6347'],
    ['Deep orange', '#ff5722'],
    ['Bright orange', '#ff9f1c'],
    ['Yellow', '#f9c74f'],
    ['Bright green', '#2bdd66'],
    ['Green', '#12b886'],
    ['Light blue', '#4dabf7'],
    ['Sky blue', '#38bdf8'],
    ['Pale blue', '#74c0fc'],
    ['Bright blue', '#228be6'],
    ['Deep blue', '#1c4ed8'],
    ['Purple', '#7950f2'],
    ['Violet', '#ae3ec9'],
    ['Bright pink', '#f06595'],
    ['Bright red', '#fa5252'],
    ['Red', '#e03131'],
];

const fallbackTheme = {
    baseColor: '#2bdd66',
};

function normalizeHex(value) {
    return /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : fallbackTheme.baseColor;
}

function applyThemeVariables(colors) {
    colors.forEach((color, index) => {
        document.documentElement.style.setProperty(`--mantine-color-theme-${index}`, color);
    });
}

function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function CopyCommand({ command }) {
    return (
        <CopyButton value={command}>
            {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy command'}>
                    <ActionIcon aria-label="Copy command" onClick={copy} radius="sm" variant="subtle">
                        <ClipboardTextIcon size={18} weight={copied ? 'fill' : 'regular'} />
                    </ActionIcon>
                </Tooltip>
            )}
        </CopyButton>
    );
}

export default function Welcome({ theme = fallbackTheme }) {
    const [baseColor, setBaseColor] = useState(normalizeHex(theme.baseColor));
    const [displayInfo, setDisplayInfo] = useState(true);
    const [saving, setSaving] = useState(false);
    const colors = useMemo(() => generateColors(normalizeHex(baseColor)), [baseColor]);

    const updateColor = (value) => {
        setBaseColor(value);

        if (/^#[0-9a-fA-F]{6}$/.test(value)) {
            applyThemeVariables(generateColors(value));
        }
    };

    const saveTheme = () => {
        setSaving(true);
        router.post(
            '/theme',
            {
                name: 'Custom',
                base_color: normalizeHex(baseColor),
                colors,
            },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            }
        );
    };

    return (
        <main className={classes.page}>
            <section className={classes.hero}>
                <div className={classes.heroContent}>
                    <div className={classes.brandMark}>
                        <img alt="GhostCompiler" src="/images/ghostcompiler-logo.png" />
                    </div>

                    <div className={classes.heroText}>
                        <Badge className={classes.badge} leftSection={<SparkleIcon size={13} weight="fill" />} variant="light">
                            Laravel React Mantine Starter
                        </Badge>
                        <Title className={classes.heroTitle}>GhostCompiler Starter Kit</Title>
                        <Text className={classes.heroLead}>
                            A clean Laravel + Inertia + React foundation with Mantine, cached themes, animated color mode, and project-specific makers for the files you actually create every day.
                        </Text>
                        <Group gap="sm">
                            <Button onClick={() => scrollToSection('install')} rightSection={<ArrowRightIcon size={16} />} size="md">
                                Start building
                            </Button>
                            <Button onClick={() => scrollToSection('commands')} size="md" variant="default">
                                View commands
                            </Button>
                        </Group>
                    </div>
                </div>
            </section>

            <section className={classes.section} id="install">
                <div className={classes.sectionHeader}>
                    <Text className={classes.eyebrow}>Install</Text>
                    <Title order={2}>Create a fresh app in one command</Title>
                </div>

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    {installCommands.map((item) => (
                        <Paper className={classes.commandPanel} key={item.label} radius="sm" withBorder>
                            <Group justify="space-between" wrap="nowrap">
                                <Stack gap={6}>
                                    <Text fw={700}>{item.label}</Text>
                                    <Code className={classes.command}>{item.command}</Code>
                                </Stack>
                                <CopyCommand command={item.command} />
                            </Group>
                        </Paper>
                    ))}
                </SimpleGrid>
            </section>

            <section className={classes.section} id="theme">
                <div className={classes.sectionHeader}>
                    <Text className={classes.eyebrow}>Theme Manager</Text>
                    <Title order={2}>Customize and cache your app theme</Title>
                </div>

                <Paper className={classes.themePanel} radius="sm" withBorder>
                    <Stack gap="lg">
                        <div className={classes.themeControls}>
                            <ColorInput
                                className={classes.colorInput}
                                format="hex"
                                label="Enter base color"
                                onChange={updateColor}
                                swatches={presets.slice(0, 10).map((preset) => preset[1])}
                                value={baseColor}
                            />

                            <Checkbox
                                checked={displayInfo}
                                className={classes.checkbox}
                                label="Display colors info"
                                onChange={(event) => setDisplayInfo(event.currentTarget.checked)}
                            />

                            <Button loading={saving} onClick={saveTheme}>
                                Save theme
                            </Button>
                        </div>

                        <Group gap={8}>
                            {presets.map(([label, color]) => (
                                <Button
                                    className={classes.preset}
                                    key={label}
                                    leftSection={<span className={classes.dot} style={{ backgroundColor: color }} />}
                                    onClick={() => updateColor(color)}
                                    size="xs"
                                    variant={normalizeHex(baseColor) === color ? 'filled' : 'default'}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Group>

                        <div className={classes.swatches}>
                            {colors.map((color, index) => (
                                <div className={classes.swatch} key={`${color}-${index}`} style={{ backgroundColor: color, maxHeight: '80px' }}>
                                    {displayInfo && (
                                        <div className={classes.swatchInfo}>
                                            <Badge className={classes.indexBadge} color={index > 5 ? 'dark' : 'gray'} variant="light">
                                                {index}
                                            </Badge>
                                            <Code className={classes.hexCode}>{color}</Code>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Stack>
                </Paper>
            </section>

            <section className={classes.section}>
                <div className={classes.sectionHeader}>
                    <Text className={classes.eyebrow}>Project Scope</Text>
                    <Title order={2}>What this starter gives you</Title>
                </div>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                    {included.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Paper className={classes.scopeCard} key={item.title} radius="sm" withBorder>
                                <ThemeIcon radius="sm" size={42} variant="light">
                                    <Icon size={22} />
                                </ThemeIcon>
                                <Text fw={800}>{item.title}</Text>
                                <Text c="dimmed" size="sm">{item.body}</Text>
                            </Paper>
                        );
                    })}
                </SimpleGrid>
            </section>

            <section className={classes.section} id="commands">
                <div className={classes.sectionHeader}>
                    <Text className={classes.eyebrow}>Artisan Makers</Text>
                    <Title order={2}>Custom commands for React-first Laravel work</Title>
                </div>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                    {customCommands.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Paper className={classes.makerCard} key={item.name} radius="sm" withBorder>
                                <Group justify="space-between" wrap="nowrap">
                                    <ThemeIcon radius="sm" size={38} variant="light">
                                        <Icon size={20} />
                                    </ThemeIcon>
                                    <CopyCommand command={item.command} />
                                </Group>
                                <Stack gap={6}>
                                    <Text fw={700}>{item.name}</Text>
                                    <Code className={classes.command}>{item.command}</Code>
                                    <Text c="dimmed" size="sm">{item.path}</Text>
                                </Stack>
                            </Paper>
                        );
                    })}
                </SimpleGrid>
            </section>

            <section className={classes.section}>
                <div className={classes.sectionHeader}>
                    <Text className={classes.eyebrow}>Mantine Demo</Text>
                    <Title order={2}>A few components are ready out of the box</Title>
                </div>

                <Paper className={classes.demoPanel} radius="sm" withBorder>
                    <Tabs defaultValue="controls" variant="pills">
                        <Tabs.List>
                            <Tabs.Tab leftSection={<RocketLaunchIcon size={16} />} value="controls">Controls</Tabs.Tab>
                            <Tabs.Tab leftSection={<DatabaseIcon size={16} />} value="data">Data</Tabs.Tab>
                            <Tabs.Tab leftSection={<GitBranchIcon size={16} />} value="status">Status</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel pt="lg" value="controls">
                            <Group>
                                <Button>Primary action</Button>
                                <Button variant="light">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                                <Switch defaultChecked label="Feature flag" />
                                <SegmentedControl data={['React', 'Laravel', 'Mantine']} defaultValue="Mantine" />
                            </Group>
                        </Tabs.Panel>

                        <Tabs.Panel pt="lg" value="data">
                            <SimpleGrid cols={{ base: 1, sm: 3 }}>
                                {['Theme cache', 'Inertia props', 'SQLite'].map((label, index) => (
                                    <Paper className={classes.metric} key={label} radius="sm" withBorder>
                                        <Text c="dimmed" size="sm">{label}</Text>
                                        <Text fw={800} size="xl">{[98, 42, 13][index]}%</Text>
                                        <Progress value={[98, 42, 13][index]} />
                                    </Paper>
                                ))}
                            </SimpleGrid>
                        </Tabs.Panel>

                        <Tabs.Panel pt="lg" value="status">
                            <Group>
                                <RingProgress
                                    label={<Text fw={700} ta="center">Ready</Text>}
                                    sections={[{ color: 'theme', value: 76 }]}
                                    size={132}
                                    thickness={12}
                                />
                                <Stack gap="xs">
                                    <Badge color="green" variant="light">Theme cached</Badge>
                                    <Badge color="blue" variant="light">React mounted</Badge>
                                    <Badge color="violet" variant="light">Makers registered</Badge>
                                </Stack>
                            </Group>
                        </Tabs.Panel>
                    </Tabs>
                </Paper>
            </section>
        </main>
    );
}
