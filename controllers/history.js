const History = require('../models/History');
const Focus = require('../models/Focus');
const Sensor = require('../models/Sensor');
const  firebase = require('../config/firebase');

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
        const focus = await Focus.findById(focusMode);
        await firebase.ref('session_data').update({
            command: "START",
            status: "CALIBRATING", 
            timer_duration: focus.focusTime,    
            relax_duration: focus.relaxTime,  
        });
        await history.save();
        setTimeout(async () => {
            await firebase.ref('session_data').update({
                status: "RUNNING", 
            });
        }, 10000);
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
        const snapshot = await firebase.ref('session_data/average').once('value');
        const fbData = snapshot.val();
        var avgTemp = fbData.sum_temp / fbData.counter;
        var avgHum = fbData.sum_humidity / fbData.counter;
        var avgLight = fbData.sum_light / fbData.counter;
        var focus= fbData.sum_focus / fbData.counter * 100.00;
        historyId = req.params.id;
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
        const historyId = req.params.id;
        let {focusTime,relaxTime,totalRound} = req.body;
        let history = await History.findById(historyId);
        if (!history.endTime === null){
            return res.status(400).json({
                success: false,
                message: `Focus session already stopped`
            });
        }
        if (focusTime === undefined || focusTime === null) {
            const historyDoc = await History.findById(historyId);
            if (!historyDoc) return res.status(404).json({ message: "History not found" });
            const modeSettings = await Focus.findById(historyDoc.focusMode); 
            
            if (modeSettings) {
                const startTime = new Date(historyDoc.date).getTime();
                const now = Date.now();
                const diffMs = now - startTime;
                const totalElapsedMinutes = diffMs / 1000 / 60;

                const settingFocus = modeSettings.focusTime;
                const settingRelax = modeSettings.relaxTime;
                const isRepeat = modeSettings.repeatOn;
                if (!isRepeat) {
                    focusTime = Math.min(totalElapsedMinutes, settingFocus);
                    relaxTime = 0;
                    totalRound = 1;
                } else {
                    const cycleTime = settingFocus + settingRelax;
                    const fullCycles = Math.floor(totalElapsedMinutes / cycleTime);
                    const remainder = totalElapsedMinutes % cycleTime;
                    let currentFocus = 0;
                    let currentRelax = 0;

                    if (remainder <= settingFocus) {
                        currentFocus = remainder;
                        currentRelax = 0;
                        totalRound = fullCycles + 1; 
                    } else {
                        currentFocus = settingFocus;
                        currentRelax = remainder - settingFocus;
                        totalRound = fullCycles + 1; 
                    }

                    focusTime = (fullCycles * settingFocus) + currentFocus;
                    relaxTime = (fullCycles * settingRelax) + currentRelax;
                }
                
                // Clean decimals
                focusTime = parseFloat(focusTime.toFixed(2));
                relaxTime = parseFloat(relaxTime.toFixed(2));

            } else {
                focusTime = 0; relaxTime = 0; totalRound = 1;
            }
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
        await firebase.ref('session_data').update({
            command: "STOP",   
        });
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