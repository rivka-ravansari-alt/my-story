import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import axios from "axios";
import API_BASE_URL from "./config";

export default function App() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/stories`)
      .then((res) => {
        setStories(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load stories. Please try again.");
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Story</Text>

      {loading && <ActivityIndicator size="large" color="#4f46e5" />}

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={stories}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: "#4f46e5",
    marginBottom: 24,
    textAlign: "center",
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e1b4b",
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
  },
  error: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 16,
  },
});
