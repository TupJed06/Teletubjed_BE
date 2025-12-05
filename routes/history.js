const express = require('express');
const {getHistory,getSensorsByHistory,getAllHistory,createHistory,updateHistory} = require('../controllers/history');

const router = express.Router();

router.route('/')
    .get(getAllHistory)
    .post(createHistory);

router.route('/:id')
    .get(getHistory)
    .put(updateHistory);

router.route('/:id/sensors')
    .get(getSensorsByHistory);

module.exports = router;