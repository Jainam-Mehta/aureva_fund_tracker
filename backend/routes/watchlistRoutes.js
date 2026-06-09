import express from 'express';
import Watchlist from '../models/Watchlist.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect); // Secure all endpoints in this route file

// GET /api/watchlist — fetch all watchlist items for logged-in user
router.get('/', async (req, res) => {
  try {
    const items = await Watchlist.find({ userId: req.user.id }).sort({ addedAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed retrieving watchlist database entries' });
  }
});

// POST /api/watchlist — add a scheme to user tracking profile
router.post('/', async (req, res) => {
  try {
    const { schemeCode, schemeName } = req.body;
    if (!schemeCode || !schemeName) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const duplicateCheck = await Watchlist.findOne({ userId: req.user.id, schemeCode });
    if (duplicateCheck) {
      return res.status(409).json({ message: 'Scheme already tracked in your watchlist' });
    }

    const watchItem = await Watchlist.create({ userId: req.user.id, schemeCode, schemeName });
    res.status(201).json(watchItem);
  } catch (error) {
    res.status(500).json({ message: 'Error mapping entry to database pipeline' });
  }
});

// DELETE /api/watchlist/:schemeCode — remove a scheme from user profile
router.delete('/:schemeCode', async (req, res) => {
  try {
    const result = await Watchlist.findOneAndDelete({ userId: req.user.id, schemeCode: req.params.schemeCode });
    if (!result) {
      return res.status(404).json({ message: 'Target asset not found in user tracking stack' });
    }
    res.status(200).json({ message: 'Success removing target asset' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing database extraction deletion' });
  }
});

export default router;
