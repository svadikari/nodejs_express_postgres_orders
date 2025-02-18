const express = require('express');
const router = express.Router();
const { createUser, userLogin } = require('./controller');

router.post('/', createUser);
router.post('/login', userLogin);

module.exports = router;
