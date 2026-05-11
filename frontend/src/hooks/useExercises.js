import { useCallback, useState } from "react";
import { exerciseService } from "../services/exerciseService";

export function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await exerciseService.getAll();
      setExercises(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createExercise = useCallback(async (payload) => {
    const created = await exerciseService.create(payload);
    setExercises((prev) => [created, ...prev]);
    return created;
  }, []);

  const deleteExerciseById = useCallback(async (id) => {
    await exerciseService.delete(id);
    setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
  }, []);

  return { exercises, loading, error, fetchAll, createExercise, deleteExerciseById };
}
