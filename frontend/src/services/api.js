import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const PROD_URL = "https://my-story-sk5b.onrender.com";
const ENV = typeof process !== "undefined" ? process.env : {};

/** Avoid "localhost" → IPv6 (::1) when the API listens on IPv4 only (common with Flask on Windows). */
function preferIpv4Loopback(url) {
  if (typeof url !== "string" || !url.trim()) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "localhost") {
      parsed.hostname = "127.0.0.1";
      return parsed.toString();
    }
  } catch {
    // ignore invalid URLs
  }
  return url;
}

const CONFIGURED_URL = preferIpv4Loopback(ENV.EXPO_PUBLIC_API_URL || ENV.API_URL);

function getDevUrl() {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080";
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    if (window.location.protocol === "https:") {
      return PROD_URL;
    }

    const host = window.location.hostname;
    // Browsers often resolve "localhost" to IPv6 (::1). If the API only listens on
    // IPv4 (127.0.0.1), axios sees a network error with no HTTP response.
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://127.0.0.1:8080";
    }
    return `http://${host}:8080`;
  }

  return "http://127.0.0.1:8080";
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
    const responseData = error?.response?.data;
    const serverMessage = responseData?.error || responseData?.msg || responseData?.message;
    const status = error?.response?.status;
    if (status === 401) {
      AsyncStorage.multiRemove(["auth_token", "auth_user"]);
      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    }

    const code = error?.code;
    const networkMessage = `Cannot reach the server at ${api.defaults.baseURL}.${
      code ? ` (${code})` : ""
    } Make sure the Flask backend is listening on port 8080 (try opening http://127.0.0.1:8080/api/health in your browser).`;
    const message =
      serverMessage ||
      (error?.response ? `Request failed with status ${status}` : error?.request ? networkMessage : error?.message) ||
      "An error occurred";
    const apiError = new Error(message);

    apiError.status = status;
    apiError.details = {
      baseURL: api.defaults.baseURL,
      method: error?.config?.method,
      url: error?.config?.url,
      serverMessage,
      originalMessage: error?.message,
      code: error?.code,
    };

    return Promise.reject(apiError);
  }
);

export default api;
