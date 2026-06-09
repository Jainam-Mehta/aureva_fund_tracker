import fs from 'fs';
const cleanRouteCode = `import express from 'express';
import axios from 'axios';
const router = express.Router();
const cacheMap = new Map();
const CACHE_DURATION_MS = 60 * 60 * 1000;
router.get('/search/:queryName', async (req, res) => {
  try {
    const { queryName } = req.params;
    console.log('Backend proxy executing live search for:', queryName);
    const response = await axios.get(\`https://mfapi.in\${queryName}\`);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('SEARCH ROUTE PROXY EXCEPTION:', error.message);
    return res.status(500).json({ message: 'Internal Server Error routing proxy search.' });
  }
});
router.get('/:schemeCode', async (req, res) => {
  try {
    const { schemeCode } = req.params;
    const now = Date.now();
    if (cacheMap.has(schemeCode)) {
      const cached = cacheMap.get(schemeCode);
      if (now - cached.timestamp < CACHE_DURATION_MS) return res.status(200).json(cached.data);
    }
    const response = await axios.get(\`https://mfapi.in\${schemeCode}\`);
    cacheMap.set(schemeCode, { timestamp: now, data: response.data });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('HISTORICAL DETAILS PROXY EXCEPTION:', error.message);
    return res.status(500).json({ message: 'Internal Server Error routing historical details.' });
  }
});
export default router;`;
fs.writeFileSync('routes/fundRoutes.js', cleanRouteCode);
console.log('FUNDROUTES.JS SUCCESSFULLY OVERWRITTEN');