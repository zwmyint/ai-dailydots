import { JournalEntry, MoodType } from '../types/journal';

const STORAGE_KEY = 'daily-journal-entries';

/**
 * LocalStorageService handles all journal entry persistence.
 * This service can be replaced with Supabase without changing component code.
 */
export class LocalStorageService {
  private static sortEntries(entries: JournalEntry[]): JournalEntry[] {
    return [...entries].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  /**
   * Retrieve all journal entries from storage
   */
  static getAllEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const entries = data ? (JSON.parse(data) as JournalEntry[]) : [];
      return this.sortEntries(entries);
    } catch (error) {
      console.error('Failed to retrieve entries:', error);
      return [];
    }
  }

  /**
   * Retrieve a single entry by date
   */
  static getEntryByDate(date: string): JournalEntry | null {
    const entries = this.getAllEntries();
    return entries.find((entry) => entry.date === date) || null;
  }

  /**
   * Save or update a journal entry
   */
  static saveEntry(date: string, mood: MoodType, content: string): JournalEntry {
    const entries = this.getAllEntries();
    const existingIndex = entries.findIndex((e) => e.date === date);
    const now = new Date().toISOString();

    const entry: JournalEntry = {
      id: existingIndex !== -1 ? entries[existingIndex].id : this.generateId(),
      date,
      mood,
      content,
      createdAt: existingIndex !== -1 ? entries[existingIndex].createdAt : now,
      updatedAt: now,
    };

    if (existingIndex !== -1) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }

    const sortedEntries = this.sortEntries(entries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedEntries));

    return entry;
  }

  /**
   * Delete a journal entry by date
   */
  static deleteEntry(date: string): boolean {
    const entries = this.getAllEntries();
    const filtered = entries.filter((e) => e.date !== date);

    if (filtered.length === entries.length) {
      return false; // Entry not found
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Clear all entries (for testing or reset)
   */
  static clearAllEntries(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Generate a unique ID for entries
   */
  private static generateId(): string {
    return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
}
