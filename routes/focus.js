const express = require('express');
const {getFocus,updateFocus,getFocuses} = require('../controllers/focus');

const router = express.Router();
router.route('/')
    .get(getFocuses);

router.route('/:id')
    .get(getFocus)
    .put(updateFocus);
module.exports = router;