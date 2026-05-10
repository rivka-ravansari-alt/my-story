import { useCallback, useState } from "react";
import { eventService } from "../services/eventService";

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getAll();
      setEvents(data);
    } catch (e) {
      console.error("Failed to load events", e.details || e);
      setError("Could not load your saved stories. Please check that the server is running and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (payload) => {
    const created = await eventService.create(payload);
    setEvents((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateEvent = useCallback(async (id, payload) => {
    const updated = await eventService.update(id, payload);
    setEvents((prev) => prev.map((event) => (event.id === id ? updated : event)));
    return updated;
  }, []);

  const deleteEventById = useCallback(
    async (id) => {
      await eventService.delete(Number(id));
      await fetchAll();
    },
    [fetchAll]
  );

  return { events, loading, error, fetchAll, createEvent, updateEvent, deleteEventById };
}
