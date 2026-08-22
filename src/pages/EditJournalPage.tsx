import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJournalContext } from '../hooks/useJournalContext';
import { JournalEntryForm } from '../components/JournalEntryForm';
import { getTodayDate } from '../utils/dateUtils';
import { MoodType } from '../types/journal';

/**
 * Add/Edit Journal Entry page
 */
export function EditJournalPage() {
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();
  const { getEntryByDate, saveEntry } = useJournalContext();
  const isNewEntryRoute = !date;
  const [selectedDate, setSelectedDate] = useState(date || getTodayDate());

  useEffect(() => {
    setSelectedDate(date || getTodayDate());
  }, [date]);

  const existingEntry = getEntryByDate(selectedDate);

  const handleSave = (date: string, mood: MoodType, content: string) => {
    saveEntry(date, mood, content);
    navigate('/journals');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <JournalEntryForm
        key={isNewEntryRoute ? `new-entry-${selectedDate}` : `edit-entry-${selectedDate}`}
        initialEntry={existingEntry || undefined}
        date={selectedDate}
        isDateEditable={isNewEntryRoute}
        onDateChange={setSelectedDate}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
