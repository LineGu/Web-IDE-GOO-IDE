const router = require('express').Router();

router.use('/account', require('./account'));
router.use('/project', require('./project'));
module.exports = router;