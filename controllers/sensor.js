const Sensor = require('../models/Sensor');
const History = require('../models/History');

exports.getSensor = async (req, res, next) => {
    try {
        sensor = await Sensor.findById(req.params.id).populate({path: 'history',selection:'_id'});
        if (!sensor){
            return res.status(404).json({
                success: false,
                message: `Not found sensor with id: ${req.params.id}`
            });
        }
        res.status(200).json({
            success: true,
            data : sensor
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        })
    }
}