import api from "./api";

export const tagService = {
  async getAll() {
    const { data } = await api.get("/api/tags/");
    return data;
  },

  async create(name, color) {
    const { data } = await api.post("/api/tags/", { name, color });
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/api/tags/${id}`, payload);
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`/api/tags/${id}`);
    return data;
  },
};
