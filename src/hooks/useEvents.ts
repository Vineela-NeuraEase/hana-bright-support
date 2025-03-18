
import { useFetchEvents } from "./events/useFetchEvents";
import { useEventOperations } from "./events/useEventOperations";

export const useEvents = () => {
  const { events, isLoading, refetch } = useFetchEvents();
  const { addEvent, updateEvent, deleteEvent } = useEventOperations();

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    refetch,
  };
};
