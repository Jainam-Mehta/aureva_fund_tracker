import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    const endpoint = isRegister ? 'register' : 'login';
    
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/${endpoint}`, { email, password });
      login(res.data.token, res.data.email);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication sequence failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '6rem auto', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{isRegister ? 'Create Account' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '500' }}>Email Address</label>
          <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '500' }}>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>
        <button type="submit" disabled={loading} style={{ 
          padding: '0.7rem', 
          background: '#10b981', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}>
          {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.9rem' }}>
          {isRegister ? 'Already have an account? Sign In' : 'Need an account? Register now'}
        </button>
      </div>
    </div>
  );
}
