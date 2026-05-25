const mongoose = require("mongoose")

let trackingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "foods"
    },
    details: {
        calories: Number,
        protein: Number,
        carbohydrates: Number,
        fat: Number,
        fiber: Number,

    },
    eatenDate: {
        type: String,
        default: new Date().toLocaleDateString()
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, { timestamps: true })

const trackingModel = mongoose.model("trackings", trackingSchema);

module.exports = trackingModel;