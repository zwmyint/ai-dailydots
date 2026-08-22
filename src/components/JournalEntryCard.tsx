import { JournalEntry, MOOD_CONFIG } from '../types/journal';
import { formatDateShort } from '../utils/dateUtils';

/**
 * Props for JournalEntryCard
 */
interface JournalEntryCardProps {
  entry: JournalEntry;
  onView?: (entry: JournalEntry) => void;
  onEdit?: (entry: JournalEntry) => void;
  onDelete?: (entry: JournalEntry) => void;
}

/**
 * JournalEntryCard displays a journal entry in card format with mood indicator
 */
export function JournalEntryCard({ entry, onView, onEdit, onDelete }: JournalEntryCardProps) {
  const moodConfig = MOOD_CONFIG[entry.mood];
  const preview = entry.content.substring(0, 120) + (entry.content.length > 120 ? '...' : '');

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h3 className="text-sm text-gray-500 font-medium mb-1">{formatDateShort(entry.date)}</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{moodConfig.emoji}</span>
            <span className="text-sm font-medium text-gray-700">{moodConfig.label}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{preview}</p>

      <div className="flex gap-2 justify-end">
        {onView && (
          <button
            onClick={() => onView(entry)}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          >
            View
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(entry)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this entry?')) {
                onDelete(entry);
              }
            }}
            className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
