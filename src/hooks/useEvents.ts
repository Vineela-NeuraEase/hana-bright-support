
import { useFetchEvents } from "./events/useFetchEvents";
import { useEventOperations } from "./events/useEventOperations";

export const useEvents = (specificUserId?: string) => {
  const { events, isLoading, refetch } = useFetchEvents(specificUserId);
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
