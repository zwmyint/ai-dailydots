import { useState, useEffect } from 'react';
import { JournalEntry, MoodType } from '../types/journal';
import { MoodPicker } from './MoodPicker';
import { formatDate } from '../utils/dateUtils';

/**
 * Props for JournalEntryForm
 */
interface JournalEntryFormProps {
  initialEntry?: JournalEntry | null;
  date: string;
  isDateEditable?: boolean;
  onDateChange?: (newDate: string) => void;
  onSave: (date: string, mood: MoodType, content: string) => void;
  onCancel?: () => void;
}

const DEFAULT_MOOD: MoodType = 'good';

/**
 * JournalEntryForm component for creating or editing journal entries
 */
export function JournalEntryForm({
  initialEntry,
  date,
  isDateEditable = false,
  onDateChange,
  onSave,
  onCancel,
}: JournalEntryFormProps) {
  const [mood, setMood] = useState<MoodType>(initialEntry?.mood || DEFAULT_MOOD);
  const [content, setContent] = useState(initialEntry?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [contentError, setContentError] = useState('');
  const characterCount = content.length;

  useEffect(() => {
    if (initialEntry) {
      setMood(initialEntry.mood);
      setContent(initialEntry.content);
      setContentError('');
      return;
    }

    setMood(DEFAULT_MOOD);
    setContent('');
    setContentError('');
  }, [initialEntry, date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setContentError('Please write something in your journal entry.');
      return;
    }

    setContentError('');
    setIsSaving(true);
    try {
      onSave(date, mood, content);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Display */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">{formatDate(date)}</h2>
        {initialEntry && (
          <span className="text-xs text-gray-500">
            Last updated: {new Date(initialEntry.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {isDateEditable && (
        <div>
          <label htmlFor="entry-date" className="block text-sm font-medium text-gray-700 mb-2">
            Entry Date
          </label>
          <input
            id="entry-date"
            type="date"
            value={date}
            onChange={(e) => onDateChange?.(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSaving}
          />
          {initialEntry && (
            <p className="mt-2 text-xs text-amber-700">
              An entry already exists for this date. Saving will update it.
            </p>
          )}
        </div>
      )}

      {/* Mood Picker */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-3">
          How are you feeling today?
        </legend>
        <MoodPicker selectedMood={mood} onChange={setMood} />
      </fieldset>

      {/* Content Textarea */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Journal Entry
          </label>
          <span className="text-xs font-medium text-gray-500" aria-live="polite" id="content-counter">
            {characterCount.toLocaleString()} character{characterCount === 1 ? '' : 's'}
          </span>
        </div>
        <textarea
          id="content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (contentError) {
              setContentError('');
            }
          }}
          placeholder="Write your thoughts, feelings, and reflections here..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isSaving}
          aria-invalid={contentError ? 'true' : 'false'}
          aria-describedby={contentError ? 'content-counter content-error' : 'content-counter'}
        />
        {contentError && (
          <p id="content-error" className="mt-2 text-xs font-medium text-red-600" role="alert">
            {contentError}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Keep writing — your thoughts will be saved when you submit.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : initialEntry ? 'Update Entry' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
}
