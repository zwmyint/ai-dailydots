import { useState, useMemo } from 'react';
import { useJournalContext } from '../hooks/useJournalContext';
import { JournalEntryCard } from '../components/JournalEntryCard';
import { getTodayDate } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

/**
 * Home page: displays journal summary and quick stats
 */
export function HomePage() {
  const navigate = useNavigate();
  const { entries, loading } = useJournalContext();
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('week');

  const stats = useMemo(() => {
    const today = getTodayDate();
    const todayEntry = entries.find((e) => e.date === today);

    // Calculate streak
    let streak = 0;
    let currentDate = new Date();
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasEntry = entries.some((e) => e.date === dateStr);
      if (!hasEntry) break;
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Mood distribution
    const moodCounts = entries.reduce(
      (acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      todayEntry,
      totalEntries: entries.length,
      streak,
      moodCounts,
    };
  }, [entries]);

  const recentEntries = useMemo(() => {
    const today = new Date();
    let filterDate = new Date();

    if (filter === 'week') {
      filterDate.setDate(today.getDate() - 7);
    } else if (filter === 'month') {
      filterDate.setMonth(today.getMonth() - 1);
    }

    return entries
      .filter((e) => filter === 'all' || new Date(e.date) >= filterDate)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [entries, filter]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center text-gray-500">Loading your journal...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalEntries}</div>
          <div className="text-sm text-blue-700">Total Entries</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="text-3xl font-bold text-purple-600 mb-1">🔥 {stats.streak}</div>
          <div className="text-sm text-purple-700">Day Streak</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {stats.todayEntry ? '✓' : '−'}
          </div>
          <div className="text-sm text-green-700">
            {stats.todayEntry ? 'Today Written' : 'Write Today'}
          </div>
        </div>
      </div>

      {/* Today's Entry CTA */}
      {!stats.todayEntry && (
        <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            📝 Don't forget to write today's entry!
          </h2>
          <p className="text-yellow-800 mb-4">
            Keep your streak going by adding today's thoughts and mood.
          </p>
          <button
            onClick={() => navigate('/new')}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500"
          >
            Add Today's Entry
          </button>
        </div>
      )}

      {/* Recent Entries */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Entries</h2>
          <div className="flex gap-2">
            {(['week', 'month', 'all'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {f === 'all' ? 'All Time' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {recentEntries.length > 0 ? (
          <div className="grid gap-4">
            {recentEntries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                onEdit={(e) => navigate(`/edit/${e.date}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-4">No entries yet. Start writing!</p>
            <button
              onClick={() => navigate('/new')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            >
              Create First Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
