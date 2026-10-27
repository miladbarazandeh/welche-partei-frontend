import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import StatsPage from './pages/StatsPage';
import PoliticianPage from './pages/PoliticianPage';
import PrivacyPage from './pages/PrivacyPage';
import ImprintPage from './pages/ImprintPage';
import HomePage from './pages/HomePage';
import WpPrivacyPage from './pages/WpPrivacyPage';
import WpImprintPage from './pages/WpImprintPage';
import ConsentModal from './components/ConsentBanner';
import { CountryRouteLayout, LanguageProvider } from './context/AppContext';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Welche Partei? — party finder at root */}
          {/* <Route path="/" element={<WelcheParteiPage />} /> */}
          <Route path="/datenschutz" element={<WpPrivacyPage />} />
          <Route path="/impressum" element={<WpImprintPage />} />
          {/* <Route path="/statistik" element={<WpStatsPage />} /> */}

          {/* Quiz game moved to /quiz */}
          <Route path="/" element={<HomePage />} />
          <Route path="/:country" element={<CountryRouteLayout />}>
            <Route index element={<App />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="politicians/:id" element={<PoliticianPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="imprint" element={<ImprintPage />} />
          </Route>
        </Routes>
        {/* <StickyPromoBar /> */}
        <ConsentModal />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);

reportWebVitals();
