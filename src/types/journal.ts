
export interface JournalEntry {
  id: string;
  user_id: string;
  timestamp: string;
  mood_rating: number;
  journal_text?: string;
  factors?: string[];
  sentiment?: string;
  created_at?: string;
}

export interface JournalFormData {
  mood_rating: number;
  journal_text: string;
  factors: string[];
}
