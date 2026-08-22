import { MoodType, MOOD_CONFIG } from '../types/journal';

const selectedMoodClasses: Record<MoodType, string> = {
  terrible: 'bg-violet-600 ring-violet-600',
  sad: 'bg-red-500 ring-red-500',
  okay: 'bg-amber-500 ring-amber-500',
  good: 'bg-blue-500 ring-blue-500',
  great: 'bg-emerald-500 ring-emerald-500',
};

/**
 * MoodPicker component for selecting a mood
 * @param selectedMood The currently selected mood
 * @param onChange Callback when a mood is selected
 */
export function MoodPicker({
  selectedMood,
  onChange,
}: {
  selectedMood: MoodType;
  onChange: (mood: MoodType) => void;
}) {
  const moods: MoodType[] = ['terrible', 'sad', 'okay', 'good', 'great'];

  return (
    <div className="flex justify-center gap-2 sm:gap-4">
      {moods.map((mood) => {
        const config = MOOD_CONFIG[mood];
        const isSelected = mood === selectedMood;

        return (
          <button
            key={mood}
            type="button"
            onClick={() => onChange(mood)}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
              isSelected
                ? `${selectedMoodClasses[mood]} text-white shadow-lg ring-2 ring-offset-2`
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
            aria-label={config.label}
            aria-pressed={isSelected}
          >
            <span className="text-2xl sm:text-3xl">{config.emoji}</span>
            <span className="text-xs sm:text-sm font-medium">{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
