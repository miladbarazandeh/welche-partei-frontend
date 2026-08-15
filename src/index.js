import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import './index.css';
import App from './App';
import StatsPage from './pages/StatsPage';
import PoliticianPage from './pages/PoliticianPage';
import PrivacyPage from './pages/PrivacyPage';
import ImprintPage from './pages/ImprintPage';
import HomePage from './pages/HomePage';
import WelcheParteiPage from './pages/WelcheParteiPage';
import WpPrivacyPage from './pages/WpPrivacyPage';
import WpImprintPage from './pages/WpImprintPage';
import WpStatsPage from './pages/WpStatsPage';
import StickyPromoBar from './components/StickyPromoBar';
import ConsentModal from './components/ConsentBanner';
import { CountryRouteLayout, LanguageProvider } from './context/AppContext';
import reportWebVitals from './reportWebVitals';

function LegacyPoliticianRedirect() {
  const { id } = useParams();
  return <Navigate to={`/quiz/de/politicians/${id}`} replace />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Welche Partei? — party finder at root */}
          <Route path="/" element={<WelcheParteiPage />} />
          <Route path="/datenschutz" element={<WpPrivacyPage />} />
          <Route path="/impressum" element={<WpImprintPage />} />
          <Route path="/statistik" element={<WpStatsPage />} />

          {/* Quiz game moved to /quiz */}
          <Route path="/quiz" element={<HomePage />} />
          <Route path="/quiz/:country" element={<CountryRouteLayout />}>
            <Route index element={<App />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="politicians/:id" element={<PoliticianPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="imprint" element={<ImprintPage />} />
          </Route>

          {/* Legacy redirects */}
          <Route path="/de" element={<Navigate to="/quiz/de" replace />} />
          <Route path="/de/stats" element={<Navigate to="/quiz/de/stats" replace />} />
          <Route path="/de/privacy" element={<Navigate to="/quiz/de/privacy" replace />} />
          <Route path="/de/imprint" element={<Navigate to="/quiz/de/imprint" replace />} />
          <Route path="/us" element={<Navigate to="/quiz/us" replace />} />
          <Route path="/stats" element={<Navigate to="/quiz/de/stats" replace />} />
          <Route path="/politicians/:id" element={<LegacyPoliticianRedirect />} />
        </Routes>
        {/* <StickyPromoBar /> */}
        <ConsentModal />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);

reportWebVitals();
