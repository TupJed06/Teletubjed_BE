const History = require('../models/History');
const Focus = require('../models/Focus');
const Sensor = require('../models/Sensor');

exports.getAllHistory = async (req, res, next) => {
    try{
        const histories = await History.find().populate({path: 'focusMode'});
        res.status(200).json({
            success: true,
            count: histories.length,
            data : histories
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: `Server Error: ${err.message}`
        })
    }
};

exports.getHistory = async (req, res, next) => {
    try{
        const history = await History.findById(req.params.id).populate({path: 'focusMode'});
        if (!history){
            return res.status(404).json({
                success: false,
                message: `Not found history with id: ${req.params.id}`
            });
        }
        res.status(200).json({
            success: true,
            data : history
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: `Server Error: ${err.message}`
        })
    }
};

exports.getSensorsByHistory = async (req, res, next) => {
    try{
        const history = await History.findById(req.params.id);
        if (!history) {
            return res.status(404).json({ success: false, message: 'History not found' });
        }
        const sensors = await Sensor.find({ historyID: req.params.id });
        res.status(200).json({
            success: true,
            count: sensors.length,
            data: sensors
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: `Server Error: ${err.message}`
        })
    }
};

exports.createHistory = async (req, res, next) => {
    try{
        let {focusMode,repeatOn} =  req.body;
        const lastHistory = await History.find().sort({ occasion: -1 }).limit(1)
        let history = new History({
            occasion: lastHistory[0].occasion + 1 ,
            date: new Date(),
            focusMode,
            startTime: new Date(),
            repeatOn,
            totalRound: 1,
            createdAt: new Date(),
        });
        await history.save();
        res.status(201).json({
            success: true,
            message: 'History created successfully',
            data: history
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message: `Server Error: ${err.message}`
        })
    }
};

exports.updateHistory = async (req, res, next) => {
    try{
        let {historyId,avgTemp,avgLight,avgHum,focus} = req.body;
        // historyId = req.params.id;
        let history = await History.findByIdAndUpdate(
            historyId,
            { avgTemp,avgLight,avgHum,focus,updatedAt: new Date() },
            { new: true, runValidators: true } 
        );

        if (!history) {
            return res.status(404).json({
                success: false,
                message: `history not found with id of ${historyId}`
            });
        }

        res.status(200).json({
            success: true,
            message: 'History updated successfully',
            data: history
        });

    }
    catch (err){
        res.status(500).json({
            success:false,
            message: `Server Error: ${err.message}`
        })
    }
};

exports.stopFocusSession = async (req, res, next) => {
    try{
        let {focusTime,relaxTime,totalRound} = req.body;
        historyId = req.params.id;
        let history = await History.findById(historyId);
        if (!history.endTime === null){
            return res.status(400).json({
                success: false,
                message: `Focus session already stopped`
            });
        }
         history = await History.findByIdAndUpdate(
            historyId,
            { endTime: new Date() ,focusTime,relaxTime,totalRound },
            { new: true, runValidators: true } 
        );

        if (!history) {
            return res.status(404).json({
                success: false,
                message: `history not found with id of ${historyId}`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Stop Focus Session successfully',
            data: history
        });

    }
    catch (err){
        res.status(500).json({
            success:false,
            message: `Server Error: ${err.message}`
        })
    }
};

exports.getCurrentHistory = async (req, res, next) => {
    try{
        // const lastHistory = await History.find().sort({ occasion: -1 }).limit(1)
        const history = await History.findOne({ endTime: null }).sort({ occasion: -1 })
        if (!history){
            return res.status(404).json({
                success: false,
                message: `No ongoing focus session found`
            });
        }
        res.status(200).json({
            success: true,
            data : history[0]._id
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: `Server Error: ${err.message}`
        })
    }
};