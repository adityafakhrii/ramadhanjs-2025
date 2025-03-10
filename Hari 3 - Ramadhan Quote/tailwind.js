tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#8B5CF6',
                    DEFAULT: '#7C3AED',
                    dark: '#6D28D9',
                },
                secondary: {
                    light: '#10B981',
                    DEFAULT: '#059669',
                    dark: '#047857',
                },
                dark: {
                    light: '#1F2937',
                    DEFAULT: '#111827',
                    dark: '#030712',
                }
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        }
    }
}