import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { JournalProvider } from './hooks/useJournalContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { MyJournalsPage } from './pages/MyJournalsPage';
import { EditJournalPage } from './pages/EditJournalPage';
import { ViewJournalPage } from './pages/ViewJournalPage';
import './index.css';

/**
 * Main App component with routing and context providers
 */
function App() {
  return (
    <JournalProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/journals" element={<MyJournalsPage />} />
              <Route path="/new" element={<EditJournalPage />} />
              <Route path="/edit/:date" element={<EditJournalPage />} />
              <Route path="/view/:date" element={<ViewJournalPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </JournalProvider>
  );
}

export default App;
