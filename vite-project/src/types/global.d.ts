declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (options: any, elementId: string) => void;
      };
    };
  }
}

export {};
