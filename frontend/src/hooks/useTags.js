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

  return { tags, loading, error, fetchAll };
}
