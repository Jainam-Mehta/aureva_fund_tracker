import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export default function FundDetail() {
  const { schemeCode } = useParams();
  const [meta, setMeta] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [range, setRange] = useState('5Y');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/funds/${schemeCode}`);
        setMeta(res.data.meta);
        const parsed = (res.data.data || []).map(item => {
          const [d, m, y] = item.date.split('-');
          return { dateStr: item.date, parsedDate: new Date(y, m - 1, d), nav: parseFloat(item.nav) };
        }).sort((a, b) => a.parsedDate - b.parsedDate);
        setChartData(parsed);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading live data stream.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [schemeCode]);
  useEffect(() => {
    if (chartData.length === 0) return;
    const latest = chartData[chartData.length - 1].parsedDate;
    let cutoff = new Date(latest);
    if (range === '1Y') cutoff.setFullYear(cutoff.getFullYear() - 1);
    else if (range === '3Y') cutoff.setFullYear(cutoff.getFullYear() - 3);
    else if (range === '5Y') cutoff.setFullYear(cutoff.getFullYear() - 5);
    else { setFilteredData(chartData); return; }
    setFilteredData(chartData.filter(d => d.parsedDate >= cutoff));
  }, [range, chartData]);
  if (loading) return <p style={{ textAlign: 'center', padding: '3rem' }}>Loading Live Performance Trends...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '3rem' }}>{error}</p>;
  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <Link to="/watchlist">← Back to Watchlist</Link>
      <h2 style={{ marginTop: '1rem' }}>{meta?.scheme_name}</h2>
      <p style={{ color: '#64748b' }}>{meta?.fund_house} | {meta?.scheme_category}</p>
      <div style={{ margin: '1rem 0', display: 'flex', gap: '0.5rem' }}>
        {['1Y', '3Y', '5Y', 'All'].map(t => (
          <button key={t} onClick={() => setRange(t)} style={{ padding: '0.5rem 1rem', background: range === t ? '#1e293b' : '#e2e8f0', color: range === t ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{t}</button>
        ))}
      </div>
      <div style={{ width: '100%', height: 400, background: '#fff', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateStr" minTickGap={50} />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip />
            <Line type="monotone" dataKey="nav" stroke="#2563eb" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}