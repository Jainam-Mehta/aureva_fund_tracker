import mongoose from 'mongoose';
const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schemeCode: { type: String, required: true },
  schemeName: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});
watchlistSchema.index({ userId: 1, schemeCode: 1 }, { unique: true });
export default mongoose.model('Watchlist', watchlistSchema);