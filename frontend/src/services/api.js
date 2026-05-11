import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const PROD_URL = "https://my-story-sk5b.onrender.com";
const ENV = typeof process !== "undefined" ? process.env : {};
const CONFIGURED_URL = ENV.EXPO_PUBLIC_API_URL || ENV.API_URL;

function getDevUrl() {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080";
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    if (window.location.protocol === "https:") {
      return PROD_URL;
    }

    return `http://${window.location.hostname}:8080`;
  }

  return "http://localhost:8080";
}

const DEV_URL = getDevUrl();
const BASE_URL = CONFIGURED_URL || (__DEV__ ? DEV_URL : PROD_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage = error?.response?.data?.error;
    const status = error?.response?.status;
    if (status === 401) {
      AsyncStorage.multiRemove(["auth_token", "auth_user"]);
      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    }

    const networkMessage = `Cannot reach the server at ${api.defaults.baseURL}. Make sure the Flask backend is running, then try again.`;
    const message = serverMessage || (error?.request ? networkMessage : error?.message) || "An error occurred";
    const apiError = new Error(message);

    apiError.status = status;
    apiError.details = {
      baseURL: api.defaults.baseURL,
      method: error?.config?.method,
      url: error?.config?.url,
      serverMessage,
      originalMessage: error?.message,
    };

    return Promise.reject(apiError);
  }
);

export default api;
