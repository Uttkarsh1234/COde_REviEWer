const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../modals/User');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const googleId = profile.id;
                    const email = profile.emails?.[0]?.value;
                    const name = profile.displayName || profile.name?.givenName || "Google User";

                    if (!email) {
                        return done(
                            new Error("Google did not provide an email"),
                            null
                        );
                    }

                    let user = await User.findOne({ googleId });

                    if (user) {
                        return done(null, user);
                    }

                    user = await User.findOne({ email });

                    if (user) {
                        user.googleId = googleId;
                        user.authProvider = "google";
                        await user.save();
                        return done(null, user);
                    }

                    user = await User.create({
                        name,
                        email,
                        googleId,
                        authProvider: "google",
                        password: null
                    });

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
} else {
    console.warn("Google OAuth credentials not configured. Google sign-in will be disabled.");
}

module.exports = passport;