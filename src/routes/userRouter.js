const express = require('express');
const router = express.Router();


const checkAuth = require('../middlewares/checkAuth')
const checkAccess = require('../middlewares/checkAccess')

const userController = require('../controllers/userController')


router.post('/unblockUser', checkAuth, checkAccess, userController.unblock);
router.post('/makeAdmin', checkAuth, checkAccess, userController.makeAdmin);
router.delete('/deleteUser', checkAuth, checkAccess, userController.delete);
router.get('/getUsers', checkAuth, checkAccess, userController.getUsers);
router.post('/blockUser', checkAuth, checkAccess, userController.block);



module.exports = router;
