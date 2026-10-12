export {};

declare global {
  interface Window {
    MMImage?: {
      openExternal(url: string): Promise<void>;
      checkUrl(url: string): Promise<{ status: number; ok: boolean }>;
    };
  }
}
