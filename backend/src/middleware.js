import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'change-this-local-secret';
export const tokenFor = user => jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '7d' });
export function requireAuth(req, res, next) { try { req.user = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), secret); next(); } catch { res.status(401).json({ error: 'Authentication required' }); } }
