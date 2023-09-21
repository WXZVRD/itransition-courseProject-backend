const GitHubStrategy = require('passport-github').Strategy;
const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require("uuid");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = () => {
    return new GitHubStrategy(
        {
            clientID: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            callbackURL: '/auth/github/callback',
            scope: [ 'user:email' ],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await User.findOne({ where: { githubId: profile.id } });

                if (existingUser) {
                    const token = jwt.sign(
                        { id: existingUser.id, role: existingUser.isAdmin ? 'admin' : 'user' },
                        JWT_SECRET, { expiresIn: '5d' }
                    );
                    return done(null, { user: existingUser, token });
                }

                const newUser = await User.create({
                    id: uuidv4(),
                    githubId: profile.id,
                    name: profile.username,
                    avatar: profile.photos[0].value,
                    isAdmin: false,
                });

                const token = jwt.sign(
                    { id: newUser.id, role: newUser.isAdmin ? 'admin' : 'user' },
                    JWT_SECRET, { expiresIn: '5d' }
                );

                return done(null, { user: newUser, token });
            } catch (error) {
                console.error('Error:', error);
                return done(error, false);
            }
        }
    );
};
