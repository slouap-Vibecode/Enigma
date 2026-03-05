import { Theme } from '@/types/theme';

// Thème Detective Conan - Thème unique de l'application
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
  backgroundImage: {
    url: '/images/conan-background.png',
    position: 'bottom right',
    size: '450px 450px',
    repeat: 'no-repeat',
    opacity: 0.2,
  },
};

// Export du thème unique
export default detectiveConanTheme;