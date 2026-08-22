import { MoodType, MOOD_CONFIG } from '../types/journal';

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
            onClick={() => onChange(mood)}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
              isSelected
                ? `bg-${config.color} text-white shadow-lg ring-2 ring-offset-2 ring-${config.color}`
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
