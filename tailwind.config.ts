import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}', 
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary adventure colors
        'story-blue': '#42A5F5',
        'tale-purple': '#AB47BC',
        'reading-red': '#EF5350',
        
        // Warm, friendly colors
        'sunshine-yellow': '#FFD54F',
        'adventure-green': '#66BB6A',
        'dream-teal': '#4DD0E1',
        'magic-orange': '#FFB74D',
        'forest-green': '#4CAF50',
        'sky-blue': '#81C784',
        
        // Soft, approachable neutrals
        'inkwell-black': '#37474F',
        'charcoal': '#546E7A',
        'fog': '#F5F5F5',
        'paper-white': '#FEFEFE',
        'cream': '#FFF8E1',
        'soft-pink': '#FCE4EC',
        'lavender': '#F3E5F5',
        
        // Status colors
        'success-green': '#4CAF50',
        'warning-amber': '#FF9800',
        'error-red': '#F44336',
        'info-blue': '#2196F3',
      },
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        comic: ['Comic Neue', 'cursive'],
        quicksand: ['Quicksand', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        literata: ['Literata', 'serif'],
      },
      fontSize: {
        'friendly-xs': ['16px', '1.5'],
        'friendly-sm': ['18px', '1.6'],
        'friendly-base': ['20px', '1.6'],
        'friendly-lg': ['24px', '1.5'],
        'friendly-xl': ['28px', '1.4'],
        'friendly-2xl': ['32px', '1.3'],
        'friendly-3xl': ['36px', '1.2'],
        'friendly-4xl': ['42px', '1.1'],
      },
      spacing: {
        'xs': '4px',
        's': '8px',
        'm': '16px',
        'l': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '80px',
        '5xl': '96px',
      },
      boxShadow: {
        'level-1': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'level-2': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'level-3': '0 8px 16px rgba(0, 0, 0, 0.15)',
        'level-4': '0 12px 24px rgba(0, 0, 0, 0.2)',
        'magical': '0 8px 32px rgba(66, 165, 245, 0.3)',
        'adventure': '0 6px 20px rgba(255, 183, 77, 0.4)',
        'gentle': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'card': '20px',
        'button': '25px',
        'input': '15px',
        'magical': '30px',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FFF8E1, #E8F5E8, #E3F2FD)',
        'adventure-gradient': 'linear-gradient(135deg, #FFD54F, #66BB6A)',
        'magical-gradient': 'linear-gradient(135deg, #42A5F5, #AB47BC)',
        'warm-gradient': 'linear-gradient(135deg, #FFB74D, #FF8A65)',
        'nature-gradient': 'linear-gradient(135deg, #4CAF50, #81C784)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};
export default config;
