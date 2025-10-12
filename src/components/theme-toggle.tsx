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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const THEMES = [
    { name: 'Slate', value: 'slate' },
    { name: 'Zinc', value: 'zinc' },
    { name: 'Rose', value: 'rose' },
    { name: 'Violet', value: 'violet' },
    { name: 'Green', value: 'green' },
];

export function ThemeToggle() {
  const { setTheme, resolvedTheme, theme } = useTheme();
  
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return <Button variant="ghost" size="icon" disabled><Sun className="h-[1.2rem] w-[1.2rem]" /></Button>
  }
  
  const currentBaseTheme = theme?.replace('dark-', '') || 'slate';
  const isDarkMode = resolvedTheme?.startsWith('dark');

  const setMode = (mode: 'light' | 'dark' | 'system') => {
    if (mode === 'system') {
        setTheme('system');
        return;
    }
    const newTheme = mode === 'dark' ? `dark-${currentBaseTheme}` : currentBaseTheme;
    setTheme(newTheme);
  }

  const setColorTheme = (color: string) => {
    const newTheme = isDarkMode ? `dark-${color}` : color;
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
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuRadioGroup 
            value={isDarkMode ? 'dark' : 'light'} 
            onValueChange={(v) => setMode(v as 'light' | 'dark')}
        >
            <DropdownMenuRadioItem value="light">
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
            </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
         <DropdownMenuLabel>Theme</DropdownMenuLabel>
         <DropdownMenuRadioGroup
            value={currentBaseTheme}
            onValueChange={setColorTheme}
         >
            {THEMES.map((themeOption) => (
                <DropdownMenuRadioItem 
                    key={themeOption.value} 
                    value={themeOption.value}
                >
                    <div className='mr-2 h-4 w-4 rounded-full' style={{backgroundColor: `hsl(var(--primary))`}} />
                    <span>{themeOption.name}</span>
                </DropdownMenuRadioItem>
            ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
