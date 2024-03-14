const router = require('express').Router();
const { getMe, updateUser } = require('../backend/controllers/users');
const { updateUserValidator } = require('../utils/validators/userValidator');

router.get('/me', getMe);
router.patch('/me', updateUserValidator, updateUser);

module.exports = router;
