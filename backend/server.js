import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Bypasses local ISP blocks completely
dns.setDefaultResultOrder('ipv4first'); // Forces Node to route via IPv4

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import fundRoutes from './routes/fundRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';

dotenv.config();
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/watchlist', watchlistRoutes);

const PORT = process.env.PORT || 5000;
const DB_URI = "mongodb+srv://jainammehta250_db_user:FSfo3Ukli8WWjOup@cluster0.ig6gyfq.mongodb.net/aureva_tracker?retryWrites=true&w=majority&appName=Cluster0";

// Force drop and establish a clean connection stream
mongoose.connection.on('connected', () => {
  console.log('Successfully connected to MongoDB Atlas (aureva_tracker)');
});

mongoose.connection.on('error', (err) => {
  console.error('Database connection error triggered:', err);
});

mongoose.connect(DB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server executing safely on port ${PORT}`));
  })
  .catch(err => {
    console.error('Critical database execution drop:', err);
    process.exit(1);
  });
