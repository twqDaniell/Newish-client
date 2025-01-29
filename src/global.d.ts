export {};

declare global {
  interface Window {
    ENV?: {
      BASE_API_URL?: string;
      BASE_PHOTO_URL?: string;
    };
  }
}