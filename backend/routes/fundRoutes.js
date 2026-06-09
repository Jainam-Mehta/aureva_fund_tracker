import express from 'express';
import axios from 'axios';
const router = express.Router();
const cacheMap = new Map();
const CACHE_DURATION_MS = 60 * 60 * 1000;
router.get('/search/:queryName', async (req, res) => {
  try {
    const { queryName } = req.params;
    const response = await axios.get(`https://api.mfapi.in/mf/search?q=${queryName}`, { timeout: 8000 });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Search route error:', error.message);
    return res.status(200).json([]);
  }
});
router.get('/:schemeCode', async (req, res) => {
  const { schemeCode } = req.params;
  const now = Date.now();
  if (cacheMap.has(schemeCode)) {
    const cached = cacheMap.get(schemeCode);
    if (now - cached.timestamp < CACHE_DURATION_MS) return res.status(200).json(cached.data);
  }
  try {
    const response = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`, { timeout: 8000 });
    const data = response.data;
    if (!data || !data.data || data.data.length === 0) {
      return res.status(404).json({ message: 'Scheme data not found' });
    }
    cacheMap.set(schemeCode, { timestamp: now, data });
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Detail route error for ${schemeCode}:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
export default router;