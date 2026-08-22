# Sample Data & Testing Guide

This guide helps you test the Daily Journal app with sample data.

## Quick Start with Sample Data

### Method 1: Browser Console (Manual)

1. Open the app in your browser: `http://localhost:5173/`
2. Open the browser's Developer Tools (F12)
3. Go to the **Console** tab
4. Paste the following code and press Enter:

```javascript
const sampleEntries = [
  {
    id: 'entry-001',
    date: '2024-08-22',
    mood: 'great',
    content: 'Today was amazing! Had a productive day at work and spent time with friends. Feeling grateful for everything in my life.',
    createdAt: '2024-08-22T08:30:00Z',
    updatedAt: '2024-08-22T08:30:00Z'
  },
  {
    id: 'entry-002',
    date: '2024-08-21',
    mood: 'good',
    content: 'Pretty good day overall. Finished the project I was working on and got positive feedback. Could have exercised more though.',
    createdAt: '2024-08-21T19:15:00Z',
    updatedAt: '2024-08-21T19:15:00Z'
  },
  {
    id: 'entry-003',
    date: '2024-08-20',
    mood: 'okay',
    content: 'Neutral kind of day. Nothing particularly good or bad happened. Felt a bit tired and unmotivated. Should get more sleep.',
    createdAt: '2024-08-20T22:45:00Z',
    updatedAt: '2024-08-20T22:45:00Z'
  },
  {
    id: 'entry-004',
    date: '2024-08-19',
    mood: 'sad',
    content: 'Had a difficult conversation with someone close. Feeling a bit down about it. Need to reflect on how to handle similar situations better.',
    createdAt: '2024-08-19T20:00:00Z',
    updatedAt: '2024-08-19T20:00:00Z'
  },
  {
    id: 'entry-005',
    date: '2024-08-18',
    mood: 'great',
    content: 'Excellent weekend! Went hiking with friends and saw a beautiful sunset. Felt connected and refreshed. This is what life is about!',
    createdAt: '2024-08-18T18:20:00Z',
    updatedAt: '2024-08-18T18:20:00Z'
  },
  {
    id: 'entry-006',
    date: '2024-08-17',
    mood: 'good',
    content: 'Great day at work. Collaborated with a talented team and made progress on a challenging problem. Excited about what we are building.',
    createdAt: '2024-08-17T17:30:00Z',
    updatedAt: '2024-08-17T17:30:00Z'
  },
  {
    id: 'entry-007',
    date: '2024-08-16',
    mood: 'terrible',
    content: 'Worst day in weeks. Nothing went right. Made mistakes at work, arguments with family. Feeling completely overwhelmed and exhausted.',
    createdAt: '2024-08-16T23:00:00Z',
    updatedAt: '2024-08-16T23:00:00Z'
  }
];

localStorage.setItem('daily-journal-entries', JSON.stringify(sampleEntries));
console.log('✅ Sample data loaded! Refresh the page to see it.');
```

5. Refresh the page and you'll see all the sample entries!

### Method 2: Automated Script (Copy-Paste)

Create a file called `load-sample-data.js` in your project root and run it with Node.js:

```bash
node load-sample-data.js
```

The script file would contain:

```javascript
// This is a Node.js script to help prepare sample data
// In a real app, you'd use this for testing purposes

const sampleEntries = [
  // ... (same data as above)
];

console.log(JSON.stringify(sampleEntries, null, 2));
```

## Data Format Reference

Each journal entry has this structure:

```typescript
{
  id: string;              // Unique identifier
  date: string;            // ISO date format: YYYY-MM-DD
  mood: string;            // 'great' | 'good' | 'okay' | 'sad' | 'terrible'
  content: string;         // The journal text (any length)
  createdAt: string;       // ISO datetime when created
  updatedAt: string;       // ISO datetime when last updated
}
```

## Testing Scenarios

### Test 1: Dashboard Stats
1. Load sample data using the console method above
2. Navigate to the Home page (`/`)
3. Verify:
   - ✅ Total Entries shows 7
   - ✅ Day Streak shows correct count
   - ✅ Recent entries display cards with moods
   - ✅ Mood distribution is visible

### Test 2: Entry Search & Filter
1. Go to My Journals page (`/journals`)
2. Try searching:
   - Search "hiking" → Should find the 2024-08-18 entry
   - Search "weekend" → Should find entries with that word
   - Search "great" → Should find all great mood entries
3. Try sorting:
   - "Newest First" → Most recent entry first
   - "Oldest First" → Oldest entry first
   - "By Mood" → Grouped by mood type

### Test 3: Create New Entry
1. Click "New Entry" or go to `/new`
2. Select today's date
3. Pick a mood using the emoji picker
4. Write some text
5. Click "Save Entry"
6. Verify it appears on the dashboard and in My Journals

### Test 4: Edit Entry
1. Go to My Journals
2. Click "Edit" on any entry
3. Change the mood and/or content
4. Click "Update Entry"
5. Verify changes are saved

### Test 5: View Entry
1. Go to My Journals
2. Click "View" on any entry
3. Verify the full content displays
4. Test "Edit" and "Delete" buttons from the view page

### Test 6: Delete Entry
1. Go to My Journals
2. Click "Delete" on an entry
3. Confirm the deletion in the prompt
4. Verify it's removed from the list
5. Note: Deleted entries cannot be recovered from localStorage (consider adding an undo feature)

## Clearing Sample Data

To clear all entries and start fresh:

```javascript
localStorage.removeItem('daily-journal-entries');
console.log('✅ All entries cleared!');
location.reload();
```

Or use the browser's DevTools → Application → Local Storage → Delete

## Debugging

### Check what's in localStorage
```javascript
const entries = JSON.parse(localStorage.getItem('daily-journal-entries') || '[]');
console.table(entries);
```

### View a specific entry
```javascript
const entries = JSON.parse(localStorage.getItem('daily-journal-entries') || '[]');
const entry = entries.find(e => e.date === '2024-08-22');
console.log(entry);
```

### Update an entry's content
```javascript
const entries = JSON.parse(localStorage.getItem('daily-journal-entries') || '[]');
const index = entries.findIndex(e => e.date === '2024-08-22');
if (index !== -1) {
  entries[index].content = 'Updated content here';
  entries[index].updatedAt = new Date().toISOString();
  localStorage.setItem('daily-journal-entries', JSON.stringify(entries));
  console.log('✅ Entry updated!');
}
```

## Performance Testing

The app should handle:
- ✅ **100+ entries** - Still responsive with search/filter
- ✅ **Large content** - Entries with 5000+ characters
- ✅ **Rapid CRUD** - Multiple quick save/edit/delete operations

If you notice slowness, check:
1. Browser DevTools → Performance tab
2. Application → Local Storage size
3. Network tab (should all be local, no API calls)

## Notes

- Sample data persists in localStorage until you manually clear it
- Each time you create a new entry, it's added to the existing sample data
- localStorage has a ~5-10MB limit per domain (plenty for journal entries)
- For production, migrate this to Supabase for proper data persistence
