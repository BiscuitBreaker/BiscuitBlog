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
router.get('/google', (req, res, next) => {
  console.log('Starting Google OAuth flow...');
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing');
  console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing');
  
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

// GET /api/auth/google/callback - Google OAuth callback
router.get('/google/callback',
  (req, res, next) => {
    console.log('OAuth callback received...');
    next();
  },
  passport.authenticate('google', { 
    failureRedirect: '/login?error=auth_failed',
    failureMessage: true 
  }),
  (req, res) => {
    try {
      console.log('OAuth success, user:', req.user);
      // Successful authentication, redirect to frontend
      const frontendUrl = process.env.FRONTEND_URL 
        ? `https://${process.env.FRONTEND_URL}` 
        : 'http://localhost:5173';
      console.log('Redirecting to:', frontendUrl);
      res.redirect(frontendUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  }
);

export default router;