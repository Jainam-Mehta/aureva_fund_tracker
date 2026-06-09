import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import WatchlistPage from './pages/WatchlistPage';
import FundDetail from './pages/FundDetail';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/fund/:schemeCode" element={<FundDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
