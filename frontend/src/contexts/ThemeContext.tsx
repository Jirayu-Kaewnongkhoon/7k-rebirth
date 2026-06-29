import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { createTheme, type Theme } from '@mui/material/styles';
import { CssBaseline, ThemeProvider } from '@mui/material';

type Mode = 'light' | 'dark';

interface ThemeContextValue {
    mode: Mode;
    toggleTheme: () => void;
}

const ThemeToggleContext = createContext<ThemeContextValue>({
    mode: 'light',
    toggleTheme: () => { },
});

export const useThemeToggle = () => useContext(ThemeToggleContext);

const createAppTheme = (mode: Mode): Theme =>
    createTheme({
        palette: { mode },
        typography: {
            fontFamily: [
                'Noto Sans Thai',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
            ].join(','),
        },
    });

export function AppThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<Mode>(
        () => (localStorage.getItem('theme') as Mode) || 'light'
    );

    const toggleTheme = () =>
        setMode(prev => {
            const next = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', next);
            return next;
        });

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    return (
        <ThemeToggleContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeToggleContext.Provider>
    );
}