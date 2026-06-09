import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    if (!query.trim()) { 
      setResults([]); 
      return; 
    }
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/funds/search/${query}`);
        const finalArray = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setResults(finalArray.slice(0, 20));
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);
  const addToWatchlist = async (schemeCode, schemeName) => {
    if (!isAuthenticated) {
      alert('Please log in first to save mutual funds to your personal watchlist.');
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/watchlist`,
        { schemeCode: String(schemeCode), schemeName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Fund successfully added to Watchlist!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving to watchlist.');
    }
  };
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Discover Indian Mutual Funds</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Search for any asset and save it directly to your tracker watchlist.</p>
      <input 
        type="text" 
        placeholder="Type to search e.g., SBI, HDFC, Nippon..." 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        style={{ 
          width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', marginBottom: '2rem'
        }}
      />
      {loading && <p style={{ textAlign: 'center', color: '#2563eb' }}>Searching matching schemes...</p>}
      {!loading && query && results.length === 0 && (
        <p style={{ textAlign: 'center', color: '#64748b' }}>No mutual funds found for "{query}"</p>
      )}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {results.map(fund => (
          <li key={fund.schemeCode} style={{ 
            padding: '1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>{fund.schemeName}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Scheme Code: <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{fund.schemeCode}</span></div>
            </div>
            <button 
              onClick={() => addToWatchlist(fund.schemeCode, fund.schemeName)} 
              style={{ padding: '0.6rem 1.2rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              + Watchlist
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}