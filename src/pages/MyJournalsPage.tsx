import { useState } from 'react';
import { useJournalContext } from '../hooks/useJournalContext';
import { JournalEntryCard } from '../components/JournalEntryCard';
import { useNavigate } from 'react-router-dom';

/**
 * My Journals page: lists all entries with search and filter options
 */
export function MyJournalsPage() {
  const navigate = useNavigate();
  const { entries, deleteEntry } = useJournalContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'mood'>('date-desc');

  const filteredEntries = entries
    .filter((entry) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        entry.date.includes(searchTerm) ||
        entry.content.toLowerCase().includes(searchLower) ||
        entry.mood.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      if (sortBy === 'mood') {
        const moodOrder = ['great', 'good', 'okay', 'sad', 'terrible'];
        return moodOrder.indexOf(a.mood) - moodOrder.indexOf(b.mood);
      }
      return 0;
    });

  const handleDelete = (date: string) => {
    deleteEntry(date);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Journal Entries</h1>

        {/* Search and Sort Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <input
              type="text"
              placeholder="Search entries by date, mood, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="mood">By Mood</option>
            </select>
          </div>
        </div>

        {/* Entry Count */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredEntries.length} of {entries.length} entries
        </div>
      </div>

      {/* Entries Grid */}
      {filteredEntries.length > 0 ? (
        <div className="grid gap-4 mb-8">
          {filteredEntries.map((entry) => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              onView={(e) => navigate(`/view/${e.date}`)}
              onEdit={(e) => navigate(`/edit/${e.date}`)}
              onDelete={() => handleDelete(entry.date)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          {entries.length === 0 ? (
            <>
              <p className="text-gray-500 mb-4 text-lg">No entries yet</p>
              <p className="text-gray-400 mb-6">Start your journal journey by creating your first entry.</p>
              <button
                onClick={() => navigate('/new')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Create First Entry
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 mb-4 text-lg">No entries match your search</p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
              >
                Clear Search
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
