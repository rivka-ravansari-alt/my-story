import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const authService = {
  async register(username, email, password) {
    const { data } = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  async login(username, password) {
    const { data } = await api.post("/api/auth/login", { username, password });
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  async logout() {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  },

  async getStoredUser() {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
};
