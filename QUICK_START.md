# Quick Start Guide

## ⚡ Get Running in 3 Steps

### 1. Install & Start
```bash
cd ai-dailydots
npm install          # Already done! ✓
npm run dev
```

Open http://localhost:5173/ in your browser.

### 2. Create Your First Entry
- Click "New Entry" or go to `/new`
- Select today's date
- Pick your mood (😄 😊 😐 😔 😢)
- Write your thoughts
- Click "Save Entry"

### 3. Explore Features
- **Home** - See your dashboard with stats
- **My Journals** - View all entries, search, filter
- **New Entry** - Create today's entry (or edit existing)

## 🎯 Common Tasks

### Create a Journal Entry
```
/ → "Add Today's Entry" button
  OR /new
```

### View All Entries
```
/journals → See all your entries
          → Search by date/mood/content
          → Filter by: Newest/Oldest/By Mood
```

### Edit an Entry
```
/journals → Click "Edit" on any card
  OR /edit/2024-08-22
```

### View Entry Details
```
/journals → Click "View" on any card
  OR /view/2024-08-22
```

### Delete an Entry
```
/journals → Click "Delete" (with confirmation)
  OR /view/2024-08-22 → Click "Delete"
```

## 📱 Mobile Responsive
Works great on:
- ✅ Desktop (lg, md screens)
- ✅ Tablet (sm screens)
- ✅ Mobile (xs screens)

## 💻 Development Commands

```bash
# Start local dev server
npm run dev

# Compile & bundle for production
npm run build

# Preview production build
npm run preview

# Run code linter
npm run lint

# Type checking (implicit with build)
npm run build
```

## 📊 Dashboard Features

- **Total Entries** - Count of all journal entries
- **Day Streak** - Consecutive days with entries
- **Today's Status** - Did you write today?
- **Recent Entries** - Last 5 entries preview
- **Time Filters** - Last week / month / all-time

## 🔍 Search & Filter

### Search Types
- **Date**: `2024-08-22`
- **Mood**: `great`, `good`, `okay`, `sad`, `terrible`
- **Content**: Any word in your entry text

### Sort Options
- **Newest First** - Today → Oldest
- **Oldest First** - Oldest → Today
- **By Mood** - Grouped by mood type

## 💾 Data Storage

Currently stored in **browser localStorage**:
- Survives page refreshes ✓
- Persists across browser sessions ✓
- Local to each browser/device (not synced)
- ~5-10MB limit per domain

To clear all data:
```javascript
// In browser console:
localStorage.removeItem('daily-journal-entries');
location.reload();
```

## 😊 Mood Emoji Guide

| Emoji | Mood | Use When |
|-------|------|----------|
| 😄 | Great | Excellent day, happy, accomplished |
| 😊 | Good | Positive day, satisfied, content |
| 😐 | Okay | Neutral day, meh, normal |
| 😔 | Sad | Difficult day, down, disappointed |
| 😢 | Terrible | Worst day, overwhelmed, crisis |

## 🎨 Styling

All styling uses **Tailwind CSS v4**:
- No CSS files per component
- Utility classes in JSX
- Responsive classes: `sm:`, `md:`, `lg:`
- Dark mode ready (add later)

## 📚 Pages Structure

```
/                    → Dashboard
/journals            → All entries
/new                 → Create entry for today
/edit/:date          → Edit entry for specific date
/view/:date          → View entry for specific date
```

## 🐛 Troubleshooting

### Dev server won't start
```bash
# Kill any existing process on port 5173
lsof -i :5173
kill -9 <PID>

# Then try again
npm run dev
```

### Changes not showing
```bash
# Clear browser cache (Ctrl+Shift+Delete)
# OR refresh the page (Ctrl+Shift+R)
# Vite has HMR, so changes should be instant
```

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript errors
```bash
# Check for type issues
npm run build   # TypeScript check runs first

# Or manually
npx tsc --noEmit
```

### localStorage not persisting
- Check browser settings (allow cookies/storage)
- Try incognito/private mode
- Clear browser data and try again
- Check DevTools → Application → Local Storage

## 📈 Performance Tips

- ✅ Vite builds super fast (~300ms)
- ✅ HMR makes development smooth
- ✅ Only ~77KB gzipped
- ✅ Tailwind optimizes CSS in production
- ✅ No unused code in final bundle

## 🔄 Next: Supabase (Optional)

When you're ready to add a real backend:

1. Read `SUPABASE_INTEGRATION.md`
2. Set up a Supabase project
3. Swap `localStorageService` for `supabaseService`
4. Add authentication
5. Deploy!

## 📞 Key Files to Know

- `src/App.tsx` - Main app & routing
- `src/hooks/useJournalContext.tsx` - Global state
- `src/services/localStorageService.ts` - Data layer
- `src/pages/*.tsx` - Routes/pages
- `src/components/*.tsx` - UI components
- `tailwind.config.ts` - Tailwind config
- `vite.config.ts` - Vite config

## 🚀 Ready to Deploy?

### Vercel (Easiest)
```bash
npm install -g vercel
vercel
# Follow prompts, done!
```

### Netlify
```bash
npm run build
# Connect your repo on netlify.com
# Auto-deploys on push!
```

## 💡 Tips & Tricks

### Browser Console Shortcuts
```javascript
// Load sample data
localStorage.setItem('daily-journal-entries', JSON.stringify([...]));
location.reload();

// See all entries
const e = JSON.parse(localStorage.getItem('daily-journal-entries'));
console.table(e);

// Find entry by date
const e = JSON.parse(localStorage.getItem('daily-journal-entries'));
console.log(e.find(x => x.date === '2024-08-22'));

// Clear everything
localStorage.clear();
location.reload();
```

### Keyboard Shortcuts
- `Ctrl+Shift+I` - Open DevTools
- `Ctrl+K` - GitHub Copilot (if using CLI)
- `F12` - DevTools toggle

## ✅ Feature Checklist

- [x] Create entry
- [x] Edit entry
- [x] Delete entry
- [x] View entry
- [x] Search entries
- [x] Filter by mood
- [x] Sort entries
- [x] Dashboard stats
- [x] Day streak counter
- [x] Responsive design
- [x] localStorage persistence
- [x] TypeScript types
- [x] Tailwind styling

---

**You're all set! Start journaling! 📝**

Questions? Check `README.md` or `PROJECT_SUMMARY.md`
