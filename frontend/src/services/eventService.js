import api from "./api";

export const eventService = {
  async getAll() {
    const { data } = await api.get("/api/events/");
    return data;
  },

  async getByDate(date) {
    const { data } = await api.get(`/api/events/by-date/${date}`);
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/api/events/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post("/api/events/", payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/api/events/${id}`, payload);
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`/api/events/${id}`);
    return data;
  },
};
