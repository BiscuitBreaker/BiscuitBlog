import { Router } from 'express';
import passport from 'passport';

const router = Router();

// GET /api/auth/me - Get current user
router.get('/me', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    return res.json({ message: 'Logged out successfully' });
  });
});

// GET /api/auth/google - Start Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// GET /api/auth/google/callback - Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=auth_failed' }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    const frontendUrl = process.env.FRONTEND_URL 
      ? `https://${process.env.FRONTEND_URL}` 
      : 'http://localhost:5173';
    res.redirect(frontendUrl);
  }
);

export default router;