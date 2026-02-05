import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { IconProvider } from './context/IconContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { LandingPage } from './pages/LandingPage';
import { AppPage } from './pages/AppPage';
import { TermsPage } from './pages/TermsPage';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route
              path="/app"
              element={
                <IconProvider>
                  <AppPage />
                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      duration: 3000,
                      style: {
                        background: '#1f2937',
                        color: '#fff',
                        borderRadius: '0.75rem',
                        padding: '12px 16px',
                      },
                      success: {
                        duration: 2000,
                        iconTheme: {
                          primary: '#10B981',
                          secondary: '#fff',
                        },
                      },
                      error: {
                        duration: 3000,
                        iconTheme: {
                          primary: '#EF4444',
                          secondary: '#fff',
                        },
                      },
                    }}
                  />
                </IconProvider>
              }
            />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
