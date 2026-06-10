import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TransitPage from './pages/TransitPage';
import DrivePage from './pages/DrivePage';
import SearchPage from './pages/SearchPage';
import InfoPage from './pages/InfoPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<TransitPage />} />
          <Route path="drive" element={<DrivePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="info" element={<InfoPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
