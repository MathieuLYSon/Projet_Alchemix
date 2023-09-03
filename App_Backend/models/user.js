const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place'}],
    musics: [{ type:mongoose.Types.ObjectId, require: true, ref: 'Music'}],
    spotifyId: { type: String, require: false },
    displayName: { type: String, require: false },
    accessToken: { type: String, require: false },
    refreshToken: { type: String, require: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);