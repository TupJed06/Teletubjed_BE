const express = require('express');
const {getFocus,updateFocus,getFocuses,selectFocusMode} = require('../controllers/focus');

const router = express.Router();
router.route('/')
    .get(getFocuses);

router.route('/:id')
    .get(getFocus)
    .put(updateFocus);

router.route('/select')
    .post(selectFocusMode);
module.exports = router;