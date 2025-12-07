const Focus = require('../models/Focus');
const  firebase = require('../config/firebase');
exports.getFocuses = async (req, res, next) => {
    try {
        // Find ALL documents in the 'focus' collection
        const focuses = await Focus.find({ isWeb: false });
        res.status(200).json({
            success: true,
            count: focuses.length,
            data: focuses
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getFocus = async (req, res, next) => {
    try{
        const focus = await Focus.findById(req.params.id);

        if (!focus){
            return res.status(404).json({
                success: false,
                message: `Not found focus mode with id: ${req.params.id}`
            });
        }
        res.status(200).json({
            success: true,
            data : focus
        })
    } catch (err){
        res.status(500).json({
            success: false,
            message: `Server Error: ${err.message}`
        })
    }
};

exports.updateFocus = async (req, res, next) => {
    try{
        let {focusName,focusTime,repeatOn,relaxTime} = req.body;
        focusId = req.params.id;
        if (!repeatOn){
            relaxTime = 0;
        }
        let focus = await Focus.findByIdAndUpdate(
            focusId,
            { focusName,focusTime,repeatOn,relaxTime },
            { new: true, runValidators: true } 
        );

        if (!focus) {
            return res.status(404).json({
                success: false,
                message: `focus not found with id of ${focusId}`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Focus updated successfully',
            data: focus
        });

    }
    catch (err){
        res.status(500).json({
            success:false,
            message: `Server Error: ${err.message}`
        })
    }
};

exports.selectFocusMode = async (req, res, next) => {
    try {
        const id = req.body.id; 
        if (!id) {
            return res.status(400).json({ success: false, message: "Please provide an 'id' in the body" });
        }
        const focusMode = await Focus.findById(id);
        if (!focusMode) {
            return res.status(404).json({ success: false, message: "Focus Mode not found" });
        }

        await firebase.ref('session_data').update({
            timer_duration: focusMode.focusTime,
            relax_duration: focusMode.relaxTime,
        });

        res.status(200).json({
            success: true
        });

    } catch (err) {
        console.error("Select Mode Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};