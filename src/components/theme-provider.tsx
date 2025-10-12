"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

type CustomThemeProviderProps = ThemeProviderProps & {
  children: React.ReactNode,
}

export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}


export function useTheme() {
    const { theme: mode, setTheme: setMode, ...rest } = useNextTheme();

    const [colorTheme, setColorThemeState] = React.useState('slate');

    React.useEffect(() => {
        // Function to get theme from localStorage
        const getThemeFromStorage = () => {
            try {
                return localStorage.getItem('color-theme') || 'slate';
            } catch (e) {
                // If localStorage is not available, default to 'slate'
                return 'slate';
            }
        };

        const storedTheme = getThemeFromStorage();
        if (storedTheme) {
            setColorThemeState(storedTheme);
            document.body.classList.forEach(className => {
                if (className.startsWith('theme-')) {
                    document.body.classList.remove(className);
                }
            });
            document.body.classList.add(`theme-${storedTheme}`);
        }
    }, []);

    const setColorTheme = (theme: string) => {
        try {
            localStorage.setItem('color-theme', theme);
        } catch (e) {
            // localStorage not available
        }
        setColorThemeState(theme);
        
        // Remove any existing theme- class and add the new one
        document.body.classList.forEach(className => {
            if (className.startsWith('theme-')) {
                document.body.classList.remove(className);
            }
        });
        document.body.classList.add(`theme-${theme}`);
    };

    return {
        mode,
        setMode,
        colorTheme,
        setColorTheme,
        ...rest
    };
}
