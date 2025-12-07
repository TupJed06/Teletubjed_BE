const express = require('express');
const {getHistory,getSensorsByHistory,getAllHistory,createHistory,updateHistory,getCurrentHistory,stopFocusSession} = require('../controllers/history');

const router = express.Router();

router.route('/')
    .get(getAllHistory)
    .post(createHistory);
    
router.route('/currentFocus')
    .get(getCurrentHistory);

router.route('/:id')
    .get(getHistory)
    .put(updateHistory);

// router.route('/:id/sensors')
//     .get(getSensorsByHistory);


router.route('/stopFocus/:id')
    .put(stopFocusSession);

module.exports = router;