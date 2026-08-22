/**
 * Journal entry type definition
 */
export interface JournalEntry {
  id: string;
  date: string; // ISO date format (YYYY-MM-DD)
  mood: MoodType;
  content: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

/**
 * Available mood types for journal entries
 */
export type MoodType = 'great' | 'good' | 'okay' | 'sad' | 'terrible';

/**
 * Mood configuration for UI rendering
 */
export const MOOD_CONFIG: Record<MoodType, { emoji: string; label: string; color: string }> = {
  great: { emoji: '😄', label: 'Great', color: 'mood-great' },
  good: { emoji: '😊', label: 'Good', color: 'mood-good' },
  okay: { emoji: '😐', label: 'Okay', color: 'mood-okay' },
  sad: { emoji: '😔', label: 'Sad', color: 'mood-sad' },
  terrible: { emoji: '😢', label: 'Terrible', color: 'mood-terrible' },
};
