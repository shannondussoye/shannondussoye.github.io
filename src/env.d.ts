interface Window {
  theme?: {
    themeValue: string;
    setPreference: () => void;
    reflectPreference: () => void;
    getTheme: () => string;
    setTheme: (val: string) => void;
  };
  initMatrix?: () => (() => void) | null;
}

interface ImportMetaEnv {
  readonly RAINDROP_TEST_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
