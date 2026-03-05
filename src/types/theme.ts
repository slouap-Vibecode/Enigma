export interface Theme {
  name: string;
  displayName: string;
  colors: {
    background: string;
    backgroundSecondary: string;
    text: string;
    textSecondary: string;
    accent: string;
    accentHover: string;
    success: string;
    error: string;
    warning: string;
    border: string;
    buttonBackground: string;
    buttonText: string;
    buttonHoverBackground: string;
    buttonHoverText: string;
    inputBackground: string;
    inputBorder: string;
    rewardBackground: string;
    rewardBorder: string;
  };
  fonts: {
    primary: string;
    secondary?: string;
  };
  shadows: {
    card: string;
    button: string;
    input: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
}

export type ThemeName = 'default' | 'detective-conan';