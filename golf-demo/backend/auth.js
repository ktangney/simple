import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from './database.js';

// Configure Google OAuth Strategy
export function setupAuth() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = db
            .prepare('SELECT * FROM users WHERE google_id = ?')
            .get(profile.id);

          if (!user) {
            // Create new user
            const result = db
              .prepare(
                'INSERT INTO users (google_id, email, name, picture) VALUES (?, ?, ?, ?)'
              )
              .run(
                profile.id,
                profile.emails[0].value,
                profile.displayName,
                profile.photos[0]?.value
              );

            user = db
              .prepare('SELECT * FROM users WHERE id = ?')
              .get(result.lastInsertRowid);
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser((id, done) => {
    try {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

// Middleware to check if user is authenticated
export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
}
