module.exports = {
  darkMode: 'class', // Enables class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Paths to your HTML and JavaScript files
  ],
  theme: {
    extend: {
      // Custom colors
      colors: {
        'custom-blue': '#007bff',
        'custom-gray': {
          light: '#f8f9fa',
          DEFAULT: '#6c757d',
          dark: '#343a40',
        },
      },
      // Custom typography
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      // Example of adding custom breakpoints
      screens: {
        'xs': '475px',
      },
      // Example of custom spacing
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // Example for customizing dark mode colors
      // You can define dark mode specific colors here
      darkSelector: '.dark-mode',
    },
  },
  variants: {
    extend: {
      // Here you can extend the variants, for example:
      borderColor: ['responsive', 'hover', 'focus', 'dark'],
      opacity: ['responsive', 'hover', 'focus', 'disabled'],
    },
  },
  plugins: [
    // Here you can add Tailwind CSS plugins for additional utilities
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
