// Design System Tokens
// Paleta de cores, espaçamentos e tipografia centralizados

export const colors = {
  primary: '#1E3A5F',
  primaryLight: '#2A4F7F',
  primaryDark: '#152847',
  
  success: '#27AE60',
  successLight: '#45B873',
  
  warning: '#F39C12',
  warningLight: '#F5B041',
  
  danger: '#E74C3C',
  dangerLight: '#EC7063',
  
  info: '#3498DB',
  infoLight: '#5DADE2',
  
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
};

export const typography = {
  fontFamily: "'Inter', 'Roboto', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  
  h1: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: '1.2',
    letterSpacing: '-0.5px',
  },
  
  h2: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: '1.3',
    letterSpacing: '-0.3px',
  },
  
  h3: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '1.4',
  },
  
  h4: {
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '1.4',
  },
  
  body: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '1.6',
  },
  
  bodySm: {
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: '1.5',
  },
  
  caption: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '1.5',
  },
  
  button: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '1.4',
  },
};

export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
};

export const transitions = {
  fast: '150ms ease-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
};
