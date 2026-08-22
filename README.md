# Daily Journal + Mood Tracker

A beautiful, modern web application for journaling and tracking your mood built with **Vite**, **React**, **TypeScript**, and **Tailwind CSS**.

## Features

✨ **Key Features:**
- 📝 **One entry per day** - One record per calendar date; saving on an existing date updates that date's entry
- 😊 **Mood tracking** - Track your mood with emoji indicators (Great, Good, Okay, Sad, Terrible)
- 📊 **Dashboard** - View your journal summary, streak counter, and mood distribution
- 📚 **Entry management** - View all entries, search, filter, and sort by newest activity or mood
- 💾 **Local persistence** - Entries are saved to browser's localStorage
- 🎨 **Clean UI** - Modern, responsive design with Tailwind CSS
- 🔄 **Easy migration path** - Service layer ready for Supabase integration

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173/`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── MoodPicker.tsx  # Mood selection component
│   ├── JournalEntryForm.tsx # Form for creating/editing entries
│   └── JournalEntryCard.tsx # Card display for entries
├── pages/              # Route-level pages
│   ├── HomePage.tsx          # Dashboard with stats and recent entries
│   ├── MyJournalsPage.tsx    # All entries with search/filter
│   ├── EditJournalPage.tsx   # Create or edit an entry
│   └── ViewJournalPage.tsx   # Read-only view of an entry
├── hooks/              # Custom React hooks
│   └── useJournalContext.tsx # Global journal state management
├── services/           # Data persistence layer
│   └── localStorageService.ts # LocalStorage implementation
├── types/              # TypeScript type definitions
│   └── journal.ts      # Journal entry types and mood config
├── utils/              # Utility functions
│   └── dateUtils.ts    # Date manipulation helpers
└── styles/             # Global styles
    └── index.css       # Tailwind + base styles
```

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Home page - dashboard with stats and recent entries |
| `/journals` | View all entries with search/filter/sort options |
| `/new` | Create a new journal entry (date is selectable) |
| `/edit/:date` | Edit an existing entry for a specific date |
| `/view/:date` | View (read-only) an entry for a specific date |

## Entry Rules

- Each calendar date can have only one entry.
- On **New Entry** (`/new`), you can choose the entry date.
- If you save using a date that already exists, that entry is updated (not duplicated).
- My Journals **Newest First** and Home **Recent Entries** are ordered by latest update time.

## Data Model

### Journal Entry
```typescript
interface JournalEntry {
  id: string;              // Unique identifier
  date: string;            // ISO date (YYYY-MM-DD)
  mood: MoodType;          // 'great' | 'good' | 'okay' | 'sad' | 'terrible'
  content: string;         // Journal text
  createdAt: string;       // ISO datetime
  updatedAt: string;       // ISO datetime
}
```

## Persistence

Currently, the app uses browser's **localStorage** to save entries. This is implemented via the `LocalStorageService` class in `src/services/localStorageService.ts`.

### Swapping to Supabase

To migrate to Supabase:

1. Create a new service file: `src/services/supabaseService.ts`
2. Implement the same interface methods as `LocalStorageService`
3. Update `useJournalContext.tsx` to use the Supabase service instead
4. Components remain unchanged - they only interact through the context hook

## Styling

The app uses **Tailwind CSS v4** with a clean, modern aesthetic:
- Responsive design (mobile-first approach)
- Semantic color palette
- Accessible focus states on all interactive elements
- No per-component CSS files - all styling via Tailwind utilities

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Type check and build
npm run build

# Run linter (oxlint)
npm run lint

# Preview production build
npm run preview
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Supabase backend integration
- [ ] User authentication
- [ ] Export entries as PDF/CSV
- [ ] Mood analytics and trends
- [ ] Dark mode
- [ ] Offline support with service workers
- [ ] Calendar view with mood indicators
- [ ] Tags and categories for entries

## Coding Standards

This project follows strict standards:
- TypeScript with strict type checking
- React functional components and hooks only
- Tailwind CSS for all styling
- Component-driven architecture
- Service layer for data persistence
- Context API for state management

## Testing

Add tests using:
- **Unit tests**: Jest or Vitest for services and utilities
- **Component tests**: React Testing Library
- **E2E tests**: Playwright or Cypress

## License

MIT

---

**Happy journaling! 📝**
