const express = require('express');
const {getSensor} = require("../controllers/sensor")

const router = express.Router();

router.route('/:id')
    .get(getSensor);

module.exports = router;