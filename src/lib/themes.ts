import { Theme } from '@/types/theme';

// Thème par défaut (actuel)
export const defaultTheme: Theme = {
  name: 'default',
  displayName: 'Thème classique',
  colors: {
    background: '#000000',
    backgroundSecondary: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#cccccc',
    accent: '#ffffff',
    accentHover: '#cccccc',
    success: '#00ff00',
    error: '#ff0000',
    warning: '#ffff00',
    border: '#ffffff',
    buttonBackground: '#000000',
    buttonText: '#ffffff',
    buttonHoverBackground: '#ffffff',
    buttonHoverText: '#000000',
    inputBackground: '#ffffff',
    inputBorder: '#000000',
    rewardBackground: '#1a1a1a',
    rewardBorder: '#333333',
  },
  fonts: {
    primary: '"Open Sans", sans-serif',
  },
  shadows: {
    card: 'none',
    button: 'none',
    input: 'none',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
};

// Thème Detective Conan
export const detectiveConanTheme: Theme = {
  name: 'detective-conan',
  displayName: '🔍 Detective Conan',
  colors: {
    background: 'linear-gradient(135deg, #0c1529 0%, #1a2b4c 50%, #0f1c3e 100%)',
    backgroundSecondary: 'linear-gradient(145deg, #1a2b4c 0%, #243759 100%)',
    text: '#e8f0ff',
    textSecondary: '#b8c8e0',
    accent: '#ff4757',
    accentHover: '#ff3742',
    success: '#2ed573',
    error: '#ff4757',
    warning: '#ffa502',
    border: '#3d5aa1',
    buttonBackground: 'linear-gradient(145deg, #2c3e50 0%, #34495e 100%)',
    buttonText: '#ecf0f1',
    buttonHoverBackground: 'linear-gradient(145deg, #ff4757 0%, #ff3742 100%)',
    buttonHoverText: '#ffffff',
    inputBackground: 'rgba(255, 255, 255, 0.1)',
    inputBorder: '#3d5aa1',
    rewardBackground: 'linear-gradient(145deg, #2c3e50 0%, #34495e 100%)',
    rewardBorder: '#ff4757',
  },
  fonts: {
    primary: '"Open Sans", sans-serif',
    secondary: '"Open Sans", sans-serif',
  },
  shadows: {
    card: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    button: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    input: '0 2px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  },
  borderRadius: {
    small: '6px',
    medium: '10px',
    large: '15px',
  },
};

export const themes = {
  default: defaultTheme,
  'detective-conan': detectiveConanTheme,
};