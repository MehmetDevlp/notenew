import { create } from 'zustand'

interface ThemeState {
  theme: 'light' | 'dark' | 'system'
  font: 'default' | 'mono' | 'serif'
  fullWidth: boolean
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setFont: (font: 'default' | 'mono' | 'serif') => void
  setFullWidth: (fullWidth: boolean) => void
  toggleTheme: () => void
  isDarkMode: () => boolean
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: 'system',
  font: 'default',
  fullWidth: false,
  
  setTheme: (theme) => {
    set({ theme })
    applyTheme(theme)
    saveThemeSettings({ theme, font: get().font, fullWidth: get().fullWidth })
  },
  
  setFont: (font) => {
    set({ font })
    applyFont(font)
    saveThemeSettings({ theme: get().theme, font, fullWidth: get().fullWidth })
  },
  
  setFullWidth: (fullWidth) => {
    set({ fullWidth })
    applyFullWidth(fullWidth)
    saveThemeSettings({ theme: get().theme, font: get().font, fullWidth })
  },
  
  toggleTheme: () => {
    const currentTheme = get().theme
    let newTheme: 'light' | 'dark' | 'system'
    
    if (currentTheme === 'system') {
      // Toggle between light and dark based on system preference
      newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark'
    } else {
      newTheme = currentTheme === 'light' ? 'dark' : 'light'
    }
    
    set({ theme: newTheme })
    applyTheme(newTheme)
    saveThemeSettings({ theme: newTheme, font: get().font, fullWidth: get().fullWidth })
  },
  
  isDarkMode: () => {
    const { theme } = get()
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme === 'dark'
  }
}))

// Apply theme to document
const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  const root = document.documentElement
  
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    // System theme
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
}

// Apply font to document
const applyFont = (font: 'default' | 'mono' | 'serif') => {
  const root = document.documentElement
  
  // Remove existing font classes
  root.classList.remove('font-default', 'font-mono', 'font-serif')
  
  // Add new font class
  if (font === 'default') {
    root.classList.add('font-default')
  } else if (font === 'mono') {
    root.classList.add('font-mono')
  } else if (font === 'serif') {
    root.classList.add('font-serif')
  }
}

// Apply full width setting
const applyFullWidth = (fullWidth: boolean) => {
  const root = document.documentElement
  
  if (fullWidth) {
    root.classList.add('full-width')
  } else {
    root.classList.remove('full-width')
  }
}

// Save theme settings to localStorage
const saveThemeSettings = (settings: { theme: string; font: string; fullWidth: boolean }) => {
  try {
    localStorage.setItem('notion-theme-settings', JSON.stringify(settings))
  } catch (error) {
    console.warn('Failed to save theme settings:', error)
  }
}

// Load theme settings from localStorage
export const loadThemeSettings = () => {
  try {
    const saved = localStorage.getItem('notion-theme-settings')
    if (saved) {
      const settings = JSON.parse(saved)
      return settings
    }
  } catch (error) {
    console.warn('Failed to load theme settings:', error)
  }
  return null
}

// Initialize theme from saved settings or system preference
export const initializeTheme = () => {
  const saved = loadThemeSettings()
  
  if (saved) {
    // Apply saved settings
    applyTheme(saved.theme)
    applyFont(saved.font)
    applyFullWidth(saved.fullWidth)
    
    // Update store with saved values
    useTheme.setState({
      theme: saved.theme,
      font: saved.font,
      fullWidth: saved.fullWidth
    })
  } else {
    // Apply system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme('system')
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const currentTheme = useTheme.getState().theme
      if (currentTheme === 'system') {
        applyTheme('system')
      }
    })
  }
}

// CSS variables for Notion-like theming
export const applyNotionTheme = () => {
  const root = document.documentElement
  
  // Light theme colors (Notion-inspired)
  root.style.setProperty('--color-bg-primary', '#ffffff')
  root.style.setProperty('--color-bg-secondary', '#f7f6f3')
  root.style.setProperty('--color-bg-tertiary', '#ebeae8')
  root.style.setProperty('--color-text-primary', '#37352f')
  root.style.setProperty('--color-text-secondary', '#787774')
  root.style.setProperty('--color-text-tertiary', '#9b9a97')
  root.style.setProperty('--color-border-primary', '#e9e8e6')
  root.style.setProperty('--color-border-secondary', '#d4d2d0')
  root.style.setProperty('--color-accent', '#2eaadc')
  root.style.setProperty('--color-accent-hover', '#2298c4')
  
  // Dark theme colors (Notion-inspired)
  root.style.setProperty('--color-dark-bg-primary', '#1f1f1f')
  root.style.setProperty('--color-dark-bg-secondary', '#2a2a2a')
  root.style.setProperty('--color-dark-bg-tertiary', '#353535')
  root.style.setProperty('--color-dark-text-primary', '#d4d4d4')
  root.style.setProperty('--color-dark-text-secondary', '#9d9d9d')
  root.style.setProperty('--color-dark-text-tertiary', '#6d6d6d')
  root.style.setProperty('--color-dark-border-primary', '#2f2f2f')
  root.style.setProperty('--color-dark-border-secondary', '#3f3f3f')
  root.style.setProperty('--color-dark-accent', '#2383e2')
  root.style.setProperty('--color-dark-accent-hover', '#1d70c2')
}

// Initialize theme on module load
if (typeof window !== 'undefined') {
  initializeTheme()
  applyNotionTheme()
}