# Supabase Integration Guide

This guide walks you through migrating the Daily Journal app from localStorage to Supabase.

## Setup Supabase

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Choose region and set a strong database password
5. Wait for the project to be provisioned

### 2. Create Tables

In the Supabase SQL Editor, run:

```sql
-- Journal entries table
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  mood TEXT NOT NULL CHECK (mood IN ('great', 'good', 'okay', 'sad', 'terrible')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS (Row Level Security)
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own entries
CREATE POLICY "Users can view their own entries"
  ON journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own entries
CREATE POLICY "Users can insert their own entries"
  ON journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own entries
CREATE POLICY "Users can update their own entries"
  ON journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own entries
CREATE POLICY "Users can delete their own entries"
  ON journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX journal_entries_user_id_date_idx ON journal_entries(user_id, date DESC);
```

### 3. Get API Credentials

1. Go to **Settings → API** in Supabase
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (safe to expose in frontend)
3. Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## Create Supabase Service

Create `src/services/supabaseService.ts`:

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { JournalEntry, MoodType } from '../types/journal';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class SupabaseService {
  /**
   * Get all entries for the current user
   */
  static async getAllEntries(): Promise<JournalEntry[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      date: row.date,
      mood: row.mood,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  /**
   * Get entry by date for current user
   */
  static async getEntryByDate(date: string): Promise<JournalEntry | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) return null;

    return {
      id: data.id,
      date: data.date,
      mood: data.mood,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  /**
   * Save or update entry
   */
  static async saveEntry(
    date: string,
    mood: MoodType,
    content: string
  ): Promise<JournalEntry> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const existing = await this.getEntryByDate(date);

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('journal_entries')
        .update({
          mood,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        date: data.date,
        mood: data.mood,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          date,
          mood,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        date: data.date,
        mood: data.mood,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  }

  /**
   * Delete entry by date
   */
  static async deleteEntry(date: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('user_id', user.id)
      .eq('date', date);

    if (error) throw error;

    return true;
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}
```

## Update Context Hook

Update `src/hooks/useJournalContext.tsx` to use SupabaseService:

```typescript
// Replace the import
// import { LocalStorageService } from '../services/localStorageService';
import { SupabaseService } from '../services/supabaseService';

// In the useEffect, replace:
useEffect(() => {
  const loadedEntries = SupabaseService.getAllEntries();
  setEntries(loadedEntries);
  setLoading(false);
}, []);

// With async version:
useEffect(() => {
  const loadEntries = async () => {
    try {
      const loadedEntries = await SupabaseService.getAllEntries();
      setEntries(loadedEntries);
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setLoading(false);
    }
  };
  
  loadEntries();
}, []);

// Update saveEntry:
const saveEntry = async (
  date: string,
  mood: MoodType,
  content: string
): Promise<JournalEntry> => {
  const entry = await SupabaseService.saveEntry(date, mood, content);
  const updatedEntries = await SupabaseService.getAllEntries();
  setEntries(updatedEntries);
  return entry;
};

// Update deleteEntry:
const deleteEntry = async (date: string): Promise<boolean> => {
  const success = await SupabaseService.deleteEntry(date);
  if (success) {
    const updatedEntries = await SupabaseService.getAllEntries();
    setEntries(updatedEntries);
  }
  return success;
};
```

## Add Authentication

Create `src/components/AuthForm.tsx`:

```typescript
import { useState } from 'react';
import { SupabaseService } from '../services/supabaseService';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Implement sign up/sign in with Supabase auth
      console.log(isSignUp ? 'Signing up' : 'Signing in', email);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h2>
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
        disabled={isLoading}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-4"
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
      </button>

      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className="w-full mt-2 text-blue-600 hover:text-blue-700"
      >
        {isSignUp ? 'Already have an account?' : 'Need an account?'}
      </button>
    </form>
  );
}
```

## Testing

1. Set up environment variables
2. Run `npm run dev`
3. Test authentication
4. Create, read, update, delete entries
5. Verify data syncs to Supabase dashboard

## Troubleshooting

### CORS Errors
- Ensure Supabase project URL is correct in `.env.local`
- Check that API key has appropriate permissions

### Auth Errors
- Verify Row Level Security (RLS) policies are set correctly
- Check that user is authenticated before making requests

### Data Not Syncing
- Check browser DevTools Network tab
- Verify entries are being saved to correct table
- Check Supabase logs in the dashboard

## Next Steps

- Add email verification
- Implement password reset
- Add user profile management
- Set up automated backups
- Monitor database performance
