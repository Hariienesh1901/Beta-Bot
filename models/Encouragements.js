const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;
const random = require("mongoose-simple-random");

const EncouragementsSchema = new Schema({
    "encouragement": {
        type: String,
        required: true
    },
    "type": {
        type: String,
        required: true,
        enum: ['starter', 'custom'],
        default: 'custom'
    }
});

EncouragementsSchema.plugin(random);

module.exports = model('Encouragements', EncouragementsSchema);