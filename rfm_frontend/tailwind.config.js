/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Style guide specified font
      },
      colors: {
        // Primary Palette (Red accents for interactive elements)
        // Using flat naming to match CSS classes used in components
        'primary-light': '#D32F2F', // Red for buttons and interactive elements (light theme)
        'primary-dark': '#EF5350', // Slightly lighter red for better contrast (dark theme)
        'primary-hover-light': '#B71C1C', // Darker red for hover states (light theme)
        'primary-hover-dark': '#D32F2F', // Standard red for hover states (dark theme)
        
        // Neutral Palette (Backgrounds, Cards, Text)
        'neutral-background-light': '#F5F5F5', // Light gray background
        'neutral-background-dark': '#121212', // Very dark background
        'neutral-card-background-light': '#FFFFFF', // White cards
        'neutral-card-background-dark': '#1E1E1E', // Dark gray cards
        'neutral-border-light': '#E0E0E0', // Light gray borders
        'neutral-border-dark': '#333333', // Dark gray borders
        'neutral-text-primary-light': '#212121', // Almost black text
        'neutral-text-primary-dark': '#FFFFFF', // White text
        'neutral-text-secondary-light': '#757575', // Medium gray text
        'neutral-text-secondary-dark': '#B3B3B3', // Light gray text
        
        // Feedback Palette (Errors, Success, Warnings)
        'feedback-error-light': '#B00020', // Dark red for errors (light theme)
        'feedback-error-dark': '#EF5350', // Lighter red for errors (dark theme)
        'feedback-success-light': '#388E3C', // Green for success (light theme)
        'feedback-success-dark': '#66BB6A', // Lighter green for success (dark theme)
        'feedback-warning-light': '#F57C00', // Orange for warnings (light theme)
        'feedback-warning-dark': '#FFA726', // Lighter orange for warnings (dark theme)
      },
      
      // Spacing system based on 4px grid
      spacing: {
        'xs': '0.25rem', // 4px
        'sm': '0.5rem',  // 8px
        'md': '1rem',    // 16px
        'lg': '1.5rem',  // 24px
        'xl': '2rem',    // 32px
        '2xl': '3rem',   // 48px
      },
    },
  },
  plugins: [],
  // Ensure custom classes are not purged during development
  safelist: [
    'bg-neutral-card-background-light',
    'bg-neutral-card-background-dark',
    'bg-neutral-background-light',
    'bg-neutral-background-dark',
    'text-neutral-text-primary-light',
    'text-neutral-text-primary-dark',
    'text-neutral-text-secondary-light',
    'text-neutral-text-secondary-dark',
    'border-neutral-border-light',
    'border-neutral-border-dark',
    'bg-primary-light',
    'bg-primary-dark',
    'bg-primary-hover-light',
    'bg-primary-hover-dark',
    'hover:bg-primary-hover-light',
    'hover:bg-primary-hover-dark',
    'dark:bg-primary-dark',
    'dark:hover:bg-primary-hover-dark',
    'focus:ring-primary-light',
    'focus:ring-primary-dark',
    'dark:focus:ring-primary-dark',
    'focus:ring-offset-neutral-background-light',
    'focus:ring-offset-neutral-background-dark',
    'dark:focus:ring-offset-neutral-background-dark',
    'text-feedback-error-light',
    'text-feedback-error-dark',
    'text-feedback-success-light',
    'text-feedback-success-dark',
    'text-feedback-warning-light',
    'text-feedback-warning-dark',
  ],
}
