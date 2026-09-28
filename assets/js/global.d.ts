export {};
declare global {
  interface Window {
    __PORTFOLIO_CONFIG__?: Readonly<{ formEndpoint?: string }>;
  }
}
