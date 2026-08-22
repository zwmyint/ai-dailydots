import { useParams, useNavigate } from 'react-router-dom';
import { useJournalContext } from '../hooks/useJournalContext';
import { MOOD_CONFIG } from '../types/journal';
import { formatDate } from '../utils/dateUtils';

/**
 * View Journal Entry page: read-only view with edit/delete options
 */
export function ViewJournalPage() {
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();
  const { getEntryByDate, deleteEntry } = useJournalContext();

  if (!date) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Entry not found</p>
      </div>
    );
  }

  const entry = getEntryByDate(date);

  if (!entry) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">No entry found for this date</p>
          <button
            onClick={() => navigate('/journals')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          >
            Back to Entries
          </button>
        </div>
      </div>
    );
  }

  const moodConfig = MOOD_CONFIG[entry.mood];

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      deleteEntry(entry.date);
      navigate('/journals');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{formatDate(entry.date)}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{moodConfig.emoji}</span>
            <span className="text-xl font-semibold text-gray-700">{moodConfig.label}</span>
          </div>
          <p className="text-xs text-gray-500">
            Last updated: {new Date(entry.updatedAt).toLocaleString()}
          </p>
        </div>

        {/* Content */}
        <div className="mb-8">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-between pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate('/journals')}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
          >
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/edit/${entry.date}`)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
