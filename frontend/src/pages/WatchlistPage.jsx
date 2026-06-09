import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const fetchWatchlist = async () => {
    try {
      const targetBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await axios.get(`${targetBaseUrl}/watchlist`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setWatchlist(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { 
    if (token) {
      fetchWatchlist(); 
    } else {
      setLoading(false);
    }
  }, [token]);
  const remove = async (code) => {
    try {
      const targetBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      await axios.delete(`${targetBaseUrl}/watchlist/${code}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setWatchlist(prev => prev.filter(i => i.schemeCode !== code));
    } catch (err) {
      alert('Error removing asset');
    }
  };
  if (loading) return <p style={{ textAlign: 'center', padding: '3rem' }}>Loading Watchlist...</p>;
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#2563eb' }}>← Back to Search</Link>
      <h2 style={{ marginTop: '1rem' }}>Your Tracked Watchlist Portfolio</h2>
      
      {watchlist.length === 0 ? (
        <p style={{ marginTop: '1rem', color: '#64748b' }}>Your watchlist is empty.</p>
      ) : (
        watchlist.map(i => (
          <div key={i.schemeCode} style={{ 
            border: '1px solid #e2e8f0', 
            padding: '1.25rem', 
            borderRadius: '8px', 
            background: '#fff', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '1rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <div>
              <Link to={`/fund/${i.schemeCode}`} style={{ fontWeight: '600', color: '#2563eb', textDecoration: 'none' }}>{i.schemeName}</Link>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Code: {i.schemeCode}</div>
            </div>
            <button onClick={() => remove(i.schemeCode)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
}