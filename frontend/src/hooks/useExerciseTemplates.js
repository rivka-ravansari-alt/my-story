import { useCallback, useState } from "react";
import { exerciseTemplateService } from "../services/exerciseTemplateService";

export function useExerciseTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await exerciseTemplateService.getAll();
      setTemplates(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (payload) => {
    const created = await exerciseTemplateService.create(payload);
    setTemplates((prev) => [created, ...prev]);
    return created;
  }, []);

  const deleteTemplateById = useCallback(async (id) => {
    await exerciseTemplateService.delete(id);
    setTemplates((prev) => prev.filter((template) => template.id !== id));
  }, []);

  return { templates, loading, error, fetchAll, createTemplate, deleteTemplateById };
}
