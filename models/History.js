const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
    {   occasion: {
        type: Number,
        required: true,
        unique: true // Ensures you never have two "No: 1"
        },
        date:{
            type: Date,
            required: true
        },
        focusMode:{
            type: mongoose.Schema.ObjectId,
            ref:'Focus',
            required: true
        },
        totalRound:{
            type: Number,
            default: 1,
            required: true
        },
        focusTime:{
            type:Number,
            default:null,
        },
        repeatOn:{
            type: Boolean,
            default: false,
            required: true
        },
        relaxTime:{
            type:Number,
            default:null,
        },
        startTime:{
            type: Date,
            required: true,
        },
        endTime:{
            type: Date,
            default:null,
        },
        createdAt:{
            type: Date,
        },
        updatedAt:{
            type: Date,
        },
    },
    {
    versionKey: false
    }
);

module.exports = mongoose.model('History', HistorySchema, 'history');