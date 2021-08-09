const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


var feedbackSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    telnum:{
        type: String,
        required: true
    },
    email:{
        type: String,
        default: ''
    },
    contactType:{
        type:String,
        required: true 
    },
    message:{
        type:String,
        required: true 
    },
    agree:{
        type: Boolean,
        required: false
    }    
}, {
    timestamps: true
});

var feedback = mongoose.model('feedback',feedbackSchema)
module.exports = feedback;