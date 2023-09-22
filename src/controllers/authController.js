const passport = require('passport');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

module.exports = {

    googleAuth: passport.authenticate('google', { scope: ['profile'] }),

    googleAuthCallback: (req, res, next) => {
        passport.authenticate(
            'google',
            {
                session: false,
                failureRedirect: '/login',
            },
            (err, user) => {
                if (err || !user) {
                    return res.status(401).json({ message: 'Authentication failed' });
                }

                console.log(user)

                const userData = {
                    id: user.user.dataValues.id,
                    name: `${user.user.dataValues.name} ${user.user.dataValues.secondName}`,
                    isBlocked: user.user.dataValues.isBlocked,
                    isAdmin: user.user.dataValues.isAdmin,
                    avatar: user.user.dataValues.avatar,
                    likes: user.user.dataValues.likes
                }

                console.log(userData)

                res.cookie('jwt', user.token, { domain: '.onrender.com', path: '/' });
                res.cookie('jwt', user.token, { domain: 'itransition-courseproject-backend.onrender.com', path: '/' });


                res.redirect('https://itransition-course-project-frontend.vercel.app')
            }
        )(req, res, next);
    },

    githubAuth: passport.authenticate('github', { scope: ['profile'] }),

    githubAuthCallback: (req, res, next) => {
        passport.authenticate(
            'github',
            {
                session: false,
                failureRedirect: '/',
            },
            (err, user) => {
                if (err || !user) {
                    return res.status(401).json({ message: 'Authentication failed' });
                }

                const userData = {
                    id: user.user.id,
                    name: user.user.name,
                    isBlocked: user.user.isBlocked,
                    isAdmin: user.user.isAdmin,
                    avatar: user.user.avatar,
                    likes: user.user.likes
                }

                res.cookie('jwt', user.token, {domain: '.vercel.app', path: '/',httpOnly:false, 
               secure:false,sameSite:false});
                res.cookie('jwt', user.token, {domain: '.itransition-course-project-frontend.vercel.app', path: '/',httpOnly:false, 
               secure:false,sameSite:false});

                res.redirect('https://itransition-course-project-frontend.vercel.app')
            }
        )(req, res, next);
    },

    logout: (req, res) => {
        res.clearCookie('jwt', {
            httpOnly: true,
            expires: new Date(0)
        });
        res.send('Logged out');
    }

};
