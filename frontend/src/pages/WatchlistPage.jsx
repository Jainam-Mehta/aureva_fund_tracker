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
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/watchlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlist(res.data);
    } catch (err) {
      console.error('Error fetching database collections:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { 
    if (token) fetchWatchlist(); 
  }, [token]);
  const removeScheme = async (code) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/watchlist/${code}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlist(prev => prev.filter(item => item.schemeCode !== code));
    } catch (err) {
      alert('Failed removing targeted items.');
    }
  };
  if (loading) return <p style={{ padding: '3rem', textAlign: 'center' }}>Loading your personal tracking watchlist...</p>;
  if (watchlist.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '0 1rem' }}>
        <h2>Your Watchlist is Empty</h2>
        <p style={{ color: '#64748b', margin: '1rem 0 2rem' }}>Discover funds on the main dashboard to add them to your tracker panel.</p>
        <Link to="/" style={{ background: '#2563eb', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '6px', textDecoration: 'none' }}>Search Funds</Link>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '1.5rem' }}>Your Tracked Mutual Funds Watchlist</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {watchlist.map(item => (
          <div key={item.schemeCode} style={{ 
            border: '1px solid #e2e8f0', 
            padding: '1.25rem', 
            borderRadius: '8px', 
            background: '#fff',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div>
              <Link to={`/fund/${item.schemeCode}`} style={{ fontWeight: '600', fontSize: '1.1rem', color: '#2563eb', textDecoration: 'none' }}>
                {item.schemeName}
              </Link>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Scheme Code: {item.schemeCode}</div>
            </div>
            <button onClick={() => removeScheme(item.schemeCode)} style={{ 
              background: '#ef4444', 
              color: '#fff', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}s