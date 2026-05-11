const ENV = typeof process !== "undefined" ? process.env : {};
const DEFAULT_GOOGLE_CLIENT_ID = "110058684309-8a4flsr03gj5da1kssqna09fro1ghrs2.apps.googleusercontent.com";

export const googleAuthConfig = {
  clientId: ENV.EXPO_PUBLIC_GOOGLE_CLIENT_ID || ENV.GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID,
  backendVerifyEndpoint: "/api/auth/google",
};
