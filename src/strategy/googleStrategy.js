const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { v4: uuidv4 } = require('uuid');
const passport = require("passport");

module.exports = () => {
    return new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'https://itransition-courseproject-backend.onrender.com/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await User.findOne({ where: { googleId: profile.id } });

                if (existingUser) {
                    const token = jwt.sign(
                        { id: existingUser.id, role: existingUser.isAdmin ? 'admin' : 'user' },
                        JWT_SECRET, { expiresIn: '5d' }
                    );
                    return done(null, { user: existingUser, token });
                }

                const newUser = await User.create({
                    id: uuidv4(),
                    googleId: profile.id,
                    name: profile.name.givenName,
                    secondName: profile.name.familyName,
                    avatar: profile.photos[0].value,
                    isAdmin: false
                });

                const token = jwt.sign(
                    { id: newUser.id, role: newUser.isAdmin ? 'admin' : 'user' },
                    JWT_SECRET, { expiresIn: '5d' }
                );

                return done(null, { user: newUser, token });
            } catch (error) {
                console.error('Error:', error);
            }
        }
    );
};

passport.serializeUser((user, done) => {
    return done(null , user)
})

passport.deserializeUser((user, done) => {
    return done(null , user)
})
