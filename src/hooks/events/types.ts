
import { Event } from "@/types/event";

// Types for event operations
export type AddEventParams = Omit<Event, "id" | "user_id">;
export type UpdateEventParams = Partial<Event>;
