const express = require('express');
const {getFocus,updateFocus} = require('../controllers/focus');

const router = express.Router();

router.route('/:id')
    .get(getFocus)
    .put(updateFocus);
module.exports = router;