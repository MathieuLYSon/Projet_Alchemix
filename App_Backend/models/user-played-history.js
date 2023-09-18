const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userPlayedHistory = new Schema({
  pull_timestamp: { type: String, require: true },
  user_id: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
  musics: { type: Object, require: true }
});

userPlayedHistory.plugin(uniqueValidator);

module.exports = mongoose.model('User_Historie', userPlayedHistory);