const express = require('express');
const passport = require('passport')
const router = express.Router()

router.get('/login', (req, res) => {
   if (req.user) {
       console.log('User logged in:', req.user);
       res.json(req.user);
   } else if (req.session) {
       console.log('User logged in:', req.session);
       res.json(req.session);
   } else {
       res.json({
           token:  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRjY2Y5OGY0LThjMzYtNDBhMC05YzY2LTFiMDUyMjY1ZDhiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NTQ5ODM4NiwiZXhwIjoxNjk1OTMwMzg2fQ.5Y5V_hqV8BBGgnnOIpJG9xejIZPsUDxss5tcz
FxHnNc',
           user: {
              id: 'dccf98f4-8c36-40a0-9c66-1b052265d8b1',
              googleId: '103983730537850764958',
              name: 'Nick',
              secondName: 'Worron',
              avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIwpkOnFh4Ex1HhvdK83fEc6R5wleDiysGp_Q_xsDGs=s96-c',
              isAdmin: true,
              isBlocked: false,
              likes: 2,
           }
       });
   }
});

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

router.get('/google/callback',
    passport.authenticate('google', {
        session: true,
        failureRedirect: '/login',
        failureFlash: true,
        keepSessionInfo: true
    }), (req, res) => {
        console.log('User authenticated with Google:', req.user); // Логирование информации о пользователе
        res.redirect('https://itransition-course-project-frontend.vercel.app')
    })

router.get('/github',  passport.authenticate('github', { scope: ['profile'] }))

router.get('/github/callback',
    passport.authenticate('github', {
        session: true,
        failureRedirect: '/login',
        failureFlash: true,
        keepSessionInfo: true
    }), (req, res) => {
        console.log('User authenticated with GitHub:', req.user); // Логирование информации о пользователе
        res.redirect('https://itransition-course-project-frontend.vercel.app')
    })

module.exports = router;
