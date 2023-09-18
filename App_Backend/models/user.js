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
    liked_musics: [{ type:mongoose.Types.ObjectId, require: true, ref: 'Liked_Music'}],
    recommended_musics: [{ type:mongoose.Types.ObjectId, require: true, ref: 'Recommended_Music'}],
    user_history: [{ type:mongoose.Types.ObjectId, require: true, ref: 'User_Historie'}],
    accessToken: { type: String, require: false },
    refreshToken: { type: String, require: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);