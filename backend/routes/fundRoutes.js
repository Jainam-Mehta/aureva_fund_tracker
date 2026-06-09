import express from 'express';
import axios from 'axios';
const router = express.Router();
const cacheMap = new Map();
const CACHE_DURATION_MS = 60 * 60 * 1000;
const PROXY_WRAP = (targetUrl) => `https://allorigins.win{encodeURIComponent(targetUrl)}`;
router.get('/search/:queryName', async (req, res) => {
  try {
    const { queryName } = req.params;
    console.log(`Backend proxy executing search query for: ${queryName}`);
    const target = `https://mfapi.in{queryName}`;
    const response = await axios.get(PROXY_WRAP(target), { timeout: 8000 });
    let parsedData = response.data;
    if (typeof parsedData === 'string') {
      parsedData = JSON.parse(parsedData);
    }
    const finalArray = Array.isArray(parsedData) ? parsedData : (parsedData?.data || []);
    return res.status(200).json(finalArray);
  } catch (error) {
    console.error('SEARCH ROUTE PROXY EXCEPTION:', error.message);
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
    const target = `https://mfapi.in{schemeCode}`;
    const response = await axios.get(PROXY_WRAP(target), { timeout: 8000 });

    let parsedData = response.data;
    if (typeof parsedData === 'string') {
      parsedData = JSON.parse(parsedData);
    }
    if (!parsedData || !parsedData.data || parsedData.data.length === 0) {
      return res.status(404).json({ message: 'Scheme data not found or empty response' });
    }
    cacheMap.set(schemeCode, { timestamp: now, data: parsedData });
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error(`Historical data fetch failure for code ${schemeCode}:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error routing historical details.' });
  }
});
export default router;