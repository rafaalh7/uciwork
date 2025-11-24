// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'message-in': 'messageIn 0.3s ease-out',
        'message-out': 'messageOut 0.3s ease-in'
      },
      keyframes: {
        messageIn: {
          '0%': { opacity: 0, transform: 'translateY(20px) scale(0.8)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' }
        },
        messageOut: {
          '0%': { opacity: 1, transform: 'translateY(0) scale(1)' },
          '100%': { opacity: 0, transform: 'translateY(-20px) scale(0.8)' }
        }
      }
    }
  },
  plugins: []
}