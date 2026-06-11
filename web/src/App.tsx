import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MapPage from './pages/MapPage';
import PlanPage from './pages/PlanPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<MapPage />} />
          <Route path="plan" element={<PlanPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
