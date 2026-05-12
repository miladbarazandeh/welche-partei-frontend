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
import StickyPromoBar from './components/StickyPromoBar';
import ConsentModal from './components/ConsentBanner';
import { CountryRouteLayout, LanguageProvider } from './context/AppContext';
import reportWebVitals from './reportWebVitals';

function LegacyPoliticianRedirect() {
  const { id } = useParams();
  return <Navigate to={`/de/politicians/${id}`} replace />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stats" element={<Navigate to="/de/stats" replace />} />
          <Route path="/politicians/:id" element={<LegacyPoliticianRedirect />} />
          <Route path="/datenschutz" element={<Navigate to="/de/privacy" replace />} />
          <Route path="/impressum" element={<Navigate to="/de/imprint" replace />} />
          <Route path="/:country" element={<CountryRouteLayout />}>
            <Route index element={<App />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="politicians/:id" element={<PoliticianPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="imprint" element={<ImprintPage />} />
          </Route>
        </Routes>
        <StickyPromoBar />
        <ConsentModal />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
