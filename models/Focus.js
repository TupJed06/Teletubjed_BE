const mongoose = require('mongoose');

const FocusSchema = new mongoose.Schema(
    {
        focusName:{
            type: String,
            required: true
        },
        focusTime:{
            type: String,
            required: true
        },
        repeatOn:{
            type: Boolean,
            default: false,
            required: true
        },
        relaxTime:{
            type:Number,
            default:null,
            required:true
        }
    }
);

module.exports = mongoose.model('Focus', FocusSchema, 'focus');