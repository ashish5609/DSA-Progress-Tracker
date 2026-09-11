import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import communityRoutes from './routes/community.js';

initializeDatabase();
const app = express();
app.use(cors()); app.use(express.json());
app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/community', communityRoutes);
app.listen(process.env.PORT || 3001, () => console.log('API running on http://localhost:3001'));
