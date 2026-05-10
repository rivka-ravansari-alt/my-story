import { useCallback, useState } from "react";
import { tagService } from "../services/tagService";

export function useTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tagService.getAll();
      setTags(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTag = useCallback(async (name, color) => {
    const created = await tagService.create(name, color);
    setTags((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  }, []);

  const updateTag = useCallback(async (id, payload) => {
    const updated = await tagService.update(id, payload);
    setTags((prev) =>
      prev
        .map((tag) => (tag.id === id ? updated : tag))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    return updated;
  }, []);

  const deleteTagById = useCallback(async (id) => {
    await tagService.delete(id);
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  }, []);

  return { tags, loading, error, fetchAll, createTag, updateTag, deleteTagById };
}
