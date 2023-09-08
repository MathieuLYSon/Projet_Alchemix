const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    inDev: { type: Boolean, require: true },
    user: [{ type:mongoose.Types.ObjectId, require: true, ref: 'User'}]
});

serviceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Service', serviceSchema);