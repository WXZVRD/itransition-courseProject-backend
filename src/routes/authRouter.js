const express = require('express');
const passport = require('passport')
const router = express.Router()

router.get('/login', (req, res) => {
    if (req.user){
       res.json(req.user)
   }
})

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))
router.get('/google/callback',
    passport.authenticate('google', {
        session: true,
        failureRedirect: '/',
        failureFlash: true,
        keepSessionInfo: true
    }), (req, res) => {
        res.redirect(process.env.CLIENT)
    })

router.get('/github',  passport.authenticate('github', { scope: ['profile'] }))
router.get('/github/callback',
    passport.authenticate('github', {
        session: true,
        failureRedirect: '/',
        failureFlash: true,
        keepSessionInfo: true
    }), (req, res) => {
        res.redirect(process.env.CLIENT)
    })

module.exports = router;
