const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var favoritedish = new Schema({
    _id:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
    
    }
});

var favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[favoritedish]
}, {
    timestamps: true
});

var favorite = mongoose.model('favorites',favoriteSchema)
module.exports = favorite;