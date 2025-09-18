import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from '../db/connection';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

// NOTE: Switches between mock (development) and database (production) based on NODE_ENV
const isProduction = process.env.NODE_ENV === 'production';

// Check if user email is in allowlist
const isEmailAllowed = (email: string): boolean => {
  if (!email) return false;
  
  // Normalize email to lowercase for case-insensitive comparison
  const normalizedEmail = email.toLowerCase().trim();
  
  // Get allowlist from environment variable
  const allowlist = process.env.ALLOWLIST?.split(',').map(e => e.toLowerCase().trim()) || [];
  
  // Check exact email matches
  if (allowlist.includes(normalizedEmail)) {
    console.log(`Email allowed (exact match): ${normalizedEmail}`);
    return true;
  }
  
  // Check domain-based matches (entries starting with @)
  const emailDomain = '@' + normalizedEmail.split('@')[1];
  const domainAllowed = allowlist.some(entry => entry.startsWith('@') && entry === emailDomain);
  
  if (domainAllowed) {
    console.log(`Email allowed (domain match): ${normalizedEmail}`);
    return true;
  }
  
  // Log for debugging (remove in production)
  console.log(`Email denied: ${normalizedEmail}`);
  console.log(`Allowlist: ${allowlist.join(', ')}`);
  
  return false;
};

// Serialize user for session
passport.serializeUser((user: any, done) => {
  if (isProduction) {
    // Production: Store user ID and fetch from database
    done(null, user.id);
  } else {
    // Development: Store full user object (no database)
    done(null, user);
  }
});

// Deserialize user from session
passport.deserializeUser(async (idOrUser: any, done) => {
  try {
    if (isProduction) {
      // Production: Fetch user from database by ID
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, idOrUser))
        .limit(1);
      
      done(null, user[0] || null);
    } else {
      // Development: Return stored user object directly
      done(null, idOrUser);
    }
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      
      if (!email || !isEmailAllowed(email)) {
        return done(null, false, { message: 'Email not in allowlist' });
      }

      if (isProduction) {
        // Production: Use database operations
        // Check if user exists
        let existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (existingUser.length > 0) {
          // Update Google ID if not set
          if (!existingUser[0].googleId) {
            await db
              .update(users)
              .set({ googleId: profile.id })
              .where(eq(users.id, existingUser[0].id));
          }
          return done(null, existingUser[0]);
        }

        // Create new user
        const newUser = await db
          .insert(users)
          .values({
            email,
            name: profile.displayName || profile.username || 'User',
            avatar: profile.photos?.[0]?.value || null,
            googleId: profile.id
          })
          .returning();

        done(null, newUser[0]);
      } else {
        // Development: Use mock user data
        const mockUser = {
          id: Math.floor(Math.random() * 1000) + 1,
          email: email,
          name: profile.displayName || profile.username || 'User',
          avatar: profile.photos?.[0]?.value || null,
          googleId: profile.id
        };

        done(null, mockUser);
      }
    } catch (error) {
      done(error as Error, undefined);
    }
  }));
}