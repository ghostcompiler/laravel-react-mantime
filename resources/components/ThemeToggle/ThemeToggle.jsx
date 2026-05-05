import { useCallback, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { DesktopIcon, MoonIcon, SunIcon } from '@phosphor-icons/react';
import {
    Affix,
    Tooltip,
    UnstyledButton,
    useComputedColorScheme,
    useMantineColorScheme,
} from '@mantine/core';
import classes from './ThemeToggle.module.css';

const themeOptions = [
    { label: 'System', value: 'auto', icon: DesktopIcon },
    { label: 'Light', value: 'light', icon: SunIcon },
    { label: 'Dark', value: 'dark', icon: MoonIcon },
];

const transitionVariant = 'circle';
const transitionDuration = 420;
const transitionFromCenter = false;

function polygonCollapsed(cx, cy, vertexCount) {
    return `polygon(${Array.from({ length: vertexCount }, () => `${cx}px ${cy}px`).join(', ')})`;
}

function getThemeTransitionClipPaths(variant, cx, cy, maxRadius, viewportWidth, viewportHeight) {
    switch (variant) {
        case 'circle':
            return [
                `circle(0px at ${cx}px ${cy}px)`,
                `circle(${maxRadius}px at ${cx}px ${cy}px)`,
            ];

        case 'square': {
            const halfW = Math.max(cx, viewportWidth - cx);
            const halfH = Math.max(cy, viewportHeight - cy);
            const halfSide = Math.max(halfW, halfH) * 1.05;
            const end = [
                `${cx - halfSide}px ${cy - halfSide}px`,
                `${cx + halfSide}px ${cy - halfSide}px`,
                `${cx + halfSide}px ${cy + halfSide}px`,
                `${cx - halfSide}px ${cy + halfSide}px`,
            ].join(', ');

            return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
        }

        case 'triangle': {
            const scale = maxRadius * 2.2;
            const dx = (Math.sqrt(3) / 2) * scale;
            const verts = [
                `${cx}px ${cy - scale}px`,
                `${cx + dx}px ${cy + 0.5 * scale}px`,
                `${cx - dx}px ${cy + 0.5 * scale}px`,
            ].join(', ');

            return [polygonCollapsed(cx, cy, 3), `polygon(${verts})`];
        }

        case 'diamond': {
            const radius = maxRadius * Math.SQRT2;
            const end = [
                `${cx}px ${cy - radius}px`,
                `${cx + radius}px ${cy}px`,
                `${cx}px ${cy + radius}px`,
                `${cx - radius}px ${cy}px`,
            ].join(', ');

            return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
        }

        case 'hexagon': {
            const radius = maxRadius * Math.SQRT2;
            const verts = [];

            for (let i = 0; i < 6; i += 1) {
                const angle = -Math.PI / 2 + (i * Math.PI) / 3;
                verts.push(`${cx + radius * Math.cos(angle)}px ${cy + radius * Math.sin(angle)}px`);
            }

            return [polygonCollapsed(cx, cy, 6), `polygon(${verts.join(', ')})`];
        }

        case 'rectangle': {
            const halfW = Math.max(cx, viewportWidth - cx);
            const halfH = Math.max(cy, viewportHeight - cy);
            const end = [
                `${cx - halfW}px ${cy - halfH}px`,
                `${cx + halfW}px ${cy - halfH}px`,
                `${cx + halfW}px ${cy + halfH}px`,
                `${cx - halfW}px ${cy + halfH}px`,
            ].join(', ');

            return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
        }

        case 'star': {
            const radius = maxRadius * Math.SQRT2 * 1.03;
            const innerRatio = 0.42;
            const starPolygon = (starRadius) => {
                const verts = [];

                for (let i = 0; i < 5; i += 1) {
                    const outerAngle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                    verts.push(`${cx + starRadius * Math.cos(outerAngle)}px ${cy + starRadius * Math.sin(outerAngle)}px`);

                    const innerAngle = outerAngle + Math.PI / 5;
                    verts.push(`${cx + starRadius * innerRatio * Math.cos(innerAngle)}px ${cy + starRadius * innerRatio * Math.sin(innerAngle)}px`);
                }

                return `polygon(${verts.join(', ')})`;
            };
            const startRadius = Math.max(2, radius * 0.025);

            return [starPolygon(startRadius), starPolygon(radius)];
        }

        default:
            return [
                `circle(0px at ${cx}px ${cy}px)`,
                `circle(${maxRadius}px at ${cx}px ${cy}px)`,
            ];
    }
}

function getTransitionGeometry(source, fromCenter) {
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    let x = viewportWidth / 2;
    let y = viewportHeight / 2;

    if (!fromCenter) {
        const { top, left, width, height } = source.getBoundingClientRect();
        x = left + width / 2;
        y = top + height / 2;
    }

    const maxRadius = Math.hypot(
        Math.max(x, viewportWidth - x),
        Math.max(y, viewportHeight - y)
    );

    return { x, y, maxRadius, viewportWidth, viewportHeight };
}

function getComputedScheme(value) {
    if (value !== 'auto') {
        return value;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle() {
    const transitionInProgress = useRef(false);
    const [expanded, setExpanded] = useState(false);
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light');

    const activeOption = useMemo(
        () => themeOptions.find((option) => option.value === colorScheme) ?? themeOptions[0],
        [colorScheme]
    );
    const ActiveIcon = activeOption.icon;
    const activeIndex = Math.max(
        themeOptions.findIndex((option) => option.value === colorScheme),
        0
    );

    const applyTheme = useCallback(
        (value, source) => {
            if (value === colorScheme) {
                setExpanded(false);

                return;
            }

            const targetComputedScheme = getComputedScheme(value);
            const shouldAnimate = targetComputedScheme !== computedColorScheme;

            const updateTheme = () => {
                document.documentElement.setAttribute('data-mantine-color-scheme', targetComputedScheme);
                setColorScheme(value);
            };

            if (
                transitionInProgress.current ||
                !shouldAnimate ||
                typeof document.startViewTransition !== 'function' ||
                !source
            ) {
                updateTheme();
                setExpanded(false);

                return;
            }

            const root = document.documentElement;
            const { x, y, maxRadius, viewportWidth, viewportHeight } = getTransitionGeometry(
                source,
                transitionFromCenter
            );
            const clipPath = getThemeTransitionClipPaths(
                transitionVariant,
                x,
                y,
                maxRadius,
                viewportWidth,
                viewportHeight
            );

            transitionInProgress.current = true;
            root.dataset.dashboardThemeVt = 'active';
            root.style.setProperty('--dashboard-theme-toggle-vt-duration', `${transitionDuration}ms`);

            const cleanup = () => {
                transitionInProgress.current = false;
                delete root.dataset.dashboardThemeVt;
                root.style.removeProperty('--dashboard-theme-toggle-vt-duration');
                setExpanded(false);
            };

            const transition = document.startViewTransition(() => {
                flushSync(updateTheme);
            });

            transition.finished?.finally?.(cleanup);
            transition.ready?.then(() => {
                root.animate(
                    {
                        clipPath,
                    },
                    {
                        duration: transitionDuration,
                        easing: transitionVariant === 'star' ? 'linear' : 'ease-in-out',
                        fill: 'forwards',
                        pseudoElement: '::view-transition-new(root)',
                    }
                );
            }).catch(cleanup);
        },
        [colorScheme, computedColorScheme, setColorScheme]
    );

    const selectTheme = (value, source) => {
        applyTheme(value, source);
    };

    return (
        <Affix position={{ bottom: 8, right: 8 }}>
            <div
                className={classes.shell}
                onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                        setExpanded(false);
                    }
                }}
                onFocus={() => setExpanded(true)}
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
            >
                {expanded && (
                    <div
                        className={classes.menu}
                        dir="ltr"
                        style={{ '--theme-toggle-active-index': activeIndex }}
                    >
                        <div
                            aria-hidden="true"
                            className={classes.indicator}
                        />

                        {themeOptions.map((option) => {
                            const Icon = option.icon;

                            return (
                                <Tooltip
                                    key={option.value}
                                    label={`${option.label} theme`}
                                    position="left"
                                    withArrow
                                >
                                    <UnstyledButton
                                        aria-label={`${option.label} theme`}
                                        className={classes.control}
                                        mod={{ active: colorScheme === option.value }}
                                        onClick={(event) => selectTheme(option.value, event.currentTarget)}
                                    >
                                        <Icon size={15} weight="bold" />
                                    </UnstyledButton>
                                </Tooltip>
                            );
                        })}
                    </div>
                )}

                <Tooltip
                    label={`${activeOption.label} theme (${computedColorScheme} active)`}
                    position="left"
                    withArrow
                >
                    <UnstyledButton
                        aria-expanded={expanded}
                        aria-label="Theme menu"
                        className={classes.trigger}
                        onClick={() => setExpanded((value) => !value)}
                    >
                        <ActiveIcon size={16} weight="bold" />
                    </UnstyledButton>
                </Tooltip>
            </div>
        </Affix>
    );
}
