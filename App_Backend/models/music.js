const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const musicSchema = new Schema({
    name: { type: String, required: true },
    note: { type: Number, required: true }
});

musicSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Music', musicSchema);