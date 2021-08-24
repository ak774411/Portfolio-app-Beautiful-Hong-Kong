const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;



var dishSchema = new Schema({
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
    category:{
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
    },
    Distance:{
        type: String,
        required: false
    },
    Duration:{
        type: String,
        required: false
    },
    Difficulty:{
        type: String,
        required: false
    },
    transport:{
        type: String,
        required: false
    }
}, {
    timestamps: true
});

var Dishes = mongoose.model('Dish',dishSchema)
module.exports = Dishes;