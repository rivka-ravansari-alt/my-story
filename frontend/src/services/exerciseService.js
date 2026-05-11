import api from "./api";

export const exerciseService = {
  async getAll() {
    const { data } = await api.get("/api/exercises/");
    return data;
  },

  async create(payload) {
    const { data } = await api.post("/api/exercises/", payload);
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`/api/exercises/${id}`);
    return data;
  },
};
