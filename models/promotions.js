const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


var promotionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    label:{
        type: String,
        default: ''
    },
    price:{
        type:Currency,
        required: true 
    },
    featured:{
        type: Boolean,
        required: false
    }    
}, {
    timestamps: true
});

var Promotion = mongoose.model('Promotions',promotionSchema)
module.exports = Promotion;