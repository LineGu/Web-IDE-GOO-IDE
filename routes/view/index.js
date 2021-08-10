const router = require('express').Router();
const middlewares = require('../../middlewares');

router.get('/editor/:title', middlewares.auth.isMember, require('./editor'));
router.get(['/', '/workspace'], middlewares.auth.isMember, require('./workspace'));
router.get(['/signup', '/signin'], middlewares.auth.isNotMember, require('./account'));
module.exports = router;