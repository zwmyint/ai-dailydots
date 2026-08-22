import { ReactNode, createContext, useContext, useState, useEffect, ReactElement } from 'react';
import { JournalEntry, MoodType } from '../types/journal';
import { LocalStorageService } from '../services/localStorageService';

interface JournalContextType {
  entries: JournalEntry[];
  loading: boolean;
  saveEntry: (date: string, mood: MoodType, content: string) => JournalEntry;
  deleteEntry: (date: string) => boolean;
  getEntryByDate: (date: string) => JournalEntry | null;
  getEntriesByMonth: (year: number, month: number) => JournalEntry[];
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export function JournalProvider({ children }: { children: ReactNode }): ReactElement {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedEntries = LocalStorageService.getAllEntries();
    setEntries(loadedEntries);
    setLoading(false);
  }, []);

  const saveEntry = (date: string, mood: MoodType, content: string): JournalEntry => {
    const entry = LocalStorageService.saveEntry(date, mood, content);
    const updatedEntries = LocalStorageService.getAllEntries();
    setEntries(updatedEntries);
    return entry;
  };

  const deleteEntry = (date: string): boolean => {
    const success = LocalStorageService.deleteEntry(date);
    if (success) {
      const updatedEntries = LocalStorageService.getAllEntries();
      setEntries(updatedEntries);
    }
    return success;
  };

  const getEntryByDate = (date: string): JournalEntry | null => {
    return LocalStorageService.getEntryByDate(date);
  };

  const getEntriesByMonth = (year: number, month: number): JournalEntry[] => {
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year && entryDate.getMonth() === month;
    });
  };

  return (
    <JournalContext.Provider
      value={{
        entries,
        loading,
        saveEntry,
        deleteEntry,
        getEntryByDate,
        getEntriesByMonth,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournalContext(): JournalContextType {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournalContext must be used within JournalProvider');
  }
  return context;
}
