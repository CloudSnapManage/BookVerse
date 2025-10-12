"use client"

import * as React from "react"
import { Moon, Sun, Palette, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const themes = [
    { name: 'Slate', value: 'slate' },
    { name: 'Zinc', value: 'zinc' },
    { name: 'Rose', value: 'rose' },
    { name: 'Violet', value: 'violet' },
    { name: 'Green', value: 'green' },
];

export function ThemeToggle() {
  const { theme, setTheme, themes: availableThemes } = useTheme()

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return <Button variant="ghost" size="icon" disabled><Sun className="h-[1.2rem] w-[1.2rem]" /></Button>
  }

  const currentThemeBase = theme?.split('-')[0] || 'slate';
  const isDarkMode = theme?.includes('dark');

  const setMode = (mode: 'light' | 'dark' | 'system') => {
    if (mode === 'system') {
        setTheme('system');
        return;
    }
    const newTheme = mode === 'dark' ? `${currentThemeBase}-dark` : currentThemeBase.replace('-dark','');
    setTheme(newTheme);
  }

  const setColorTheme = (color: string) => {
    const newTheme = isDarkMode ? `${color}-dark` : color;
    setTheme(newTheme);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(currentThemeBase.replace('-dark',''))}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(`${currentThemeBase}-dark`)}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
            <Sun className="mr-2 h-4 w-4" /> {/* Or a different icon for system */}
            <span>System</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" />
                <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    {themes.map((themeOption) => {
                        const baseTheme = theme?.split('-')[0];
                        return (
                            <DropdownMenuItem 
                                key={themeOption.value} 
                                onClick={() => {
                                    const isDark = theme?.endsWith('-dark');
                                    setTheme(isDark ? `${themeOption.value}-dark` : themeOption.value);
                                }}
                                className={cn(
                                    "justify-between",
                                    baseTheme === themeOption.value && "bg-accent"
                                )}
                            >
                                <span>{themeOption.name}</span>
                                {baseTheme === themeOption.value && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
