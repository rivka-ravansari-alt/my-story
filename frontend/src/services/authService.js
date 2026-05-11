import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { googleAuthConfig } from "../config/googleAuthConfig";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

async function storeSession(data) {
  await AsyncStorage.setItem(TOKEN_KEY, data.token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export const authService = {
  async loginWithGoogle(idToken) {
    if (!googleAuthConfig.clientId) {
      throw new Error("Google login is not configured. Please add EXPO_PUBLIC_GOOGLE_CLIENT_ID.");
    }
    if (!idToken) throw new Error("Google did not return a login token.");

    const { data } = await api.post(googleAuthConfig.backendVerifyEndpoint, {
      idToken,
    });
    await storeSession(data);
    return data;
  },

  async logout() {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  },

  async getStoredSession() {
    const [token, rawUser] = await Promise.all([
      AsyncStorage.getItem(TOKEN_KEY),
      AsyncStorage.getItem(USER_KEY),
    ]);

    if (!token || !rawUser) {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      return null;
    }

    return { token, user: JSON.parse(rawUser) };
  },

  async getStoredUser() {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
};
