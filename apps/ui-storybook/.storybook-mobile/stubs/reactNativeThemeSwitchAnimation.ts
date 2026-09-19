type SwitchThemeParams = {
  switchThemeFunction: () => void;
  animationConfig?: unknown;
};

const switchTheme = ({ switchThemeFunction }: SwitchThemeParams): void => {
  switchThemeFunction();
};

export default switchTheme;
