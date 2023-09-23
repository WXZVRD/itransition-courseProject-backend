const express = require('express');
const passport = require('passport')
const router = express.Router()

router.get('/login', (req, res) => {
   if (req.user){
       console.log('User logged in:', req.user); // Логирование информации о пользователе
       res.json(req.user);
   } 
})

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
