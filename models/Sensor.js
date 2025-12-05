const mongoose = require('mongoose');
const SensorSchema =  new mongoose.Schema(
    {
        history:{
            type: mongoose.Schema.ObjectId,
            ref:'History',
            required: true
        },
        light:{
            type: Number,
            required: true
        },
        temp:{
            type: Number,
            required: true
        },
        humidity:{
            type: Number,
            required: true
        },
        distance:{
            type: Number,
            required: true
        },
        weight:{
            type: Boolean,
            required: true
        }
    },
    {
    versionKey: false
    }
);

module.exports = mongoose.model('Sensor', SensorSchema, 'sensor');
