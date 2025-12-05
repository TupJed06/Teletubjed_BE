const Focus = require('../models/Focus');

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