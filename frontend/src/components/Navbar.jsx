import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, userEmail, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem 2rem', 
      background: '#1e293b', 
      color: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.25rem' }}>
        Aureva Fund Tracker
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{userEmail}</span>
            <Link to="/watchlist" style={{ color: '#fff', textDecoration: 'none' }}>Watchlist</Link>
            <button onClick={handleLogout} style={{ 
              background: '#ef4444', 
              color: '#fff', 
              border: 'none', 
              padding: '0.4rem 0.8rem', 
              borderRadius: '4px',
              cursor: 'pointer' 
            }}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none', background: '#3b82f6', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
}
