// Tailwind CSS Custom Configuration
// Este arquivo serve como referência para customização do Tailwind

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        'primary-light': '#2A4F7F',
        'primary-dark': '#152847',
        success: '#27AE60',
        'success-light': '#45B873',
        warning: '#F39C12',
        'warning-light': '#F5B041',
        danger: '#E74C3C',
        'danger-light': '#EC7063',
        info: '#3498DB',
        'info-light': '#5DADE2',
      },
      spacing: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
};
