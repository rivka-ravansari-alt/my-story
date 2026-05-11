import api from "./api";

export const exerciseTemplateService = {
  async getAll() {
    const { data } = await api.get("/api/exercise-templates/");
    return data;
  },

  async create(payload) {
    const { data } = await api.post("/api/exercise-templates/", payload);
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`/api/exercise-templates/${id}`);
    return data;
  },
};
