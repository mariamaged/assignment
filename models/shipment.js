const mongoose = require('mongoose');
const ShipmentSchema = mongoose.Schema({
    serviceID: { type: String, required: true },
    serviceType: { type: String, required: true },
    weightUnit: { type: String, required: true },
    weightValue: { type: Number, required: true },
    heightUnit: { type: String, required: true },
    heightValue: { type: Number, required: true },
    lengthUnit: { type: String, required: true },
    lengthValue: { type: Number, required: true },
    widthUnit: { type: String, required: true },
    widthValue: { type: Number, required: true }
},

    {
        strict: false,
        timestamps: true
    });

module.exports = mongoose.model('Shipment', ShipmentSchema);