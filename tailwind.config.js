/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        '2xl': "calc(var(--radius) + 8px)",
        '3xl': "calc(var(--radius) + 16px)",
      },
      boxShadow: {
        'glow-sm': '0 0 16px rgba(99,102,241,0.2)',
        'glow-md': '0 0 32px rgba(99,102,241,0.25)',
        'glow-lg': '0 0 64px rgba(99,102,241,0.3)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(99,102,241,0.06)',
        'card-hover': '0 8px 32px rgba(99,102,241,0.14), 0 2px 8px rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease both',
        'float': 'float 4s ease-in-out infinite',
        'blob-drift': 'blob-drift 8s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        'fade-up': {
          'from': { opacity: '0', transform: 'translateY(24px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(1deg)' },
          '50%': { transform: 'translateY(-10px) rotate(0.5deg)' },
        },
        'blob-drift': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(30px, 20px) scale(1.05)' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
