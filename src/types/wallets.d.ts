// Types for Google's script that draws the official Google Pay button on /checkout (visual only).
export {};

declare global {
  interface Window {
    google?: {
      payments: {
        api: {
          PaymentsClient: new (options: { environment: 'TEST' | 'PRODUCTION' }) => {
            createButton: (options: {
              onClick: () => void;
              buttonColor?: 'default' | 'black' | 'white';
              buttonType?: 'book' | 'buy' | 'checkout' | 'donate' | 'order' | 'pay' | 'plain' | 'subscribe';
              buttonSizeMode?: 'static' | 'fill';
              buttonRadius?: number;
              buttonLocale?: string;
            }) => HTMLElement;
          };
        };
      };
    };
  }
}
