const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const musicRecommendedSchema = new Schema({
    added_at: { type: String, require: true },
    track_id: { type: String, require: true },
    titre: { type: String, require: true },
    artists: [{ type: String, require: true }],
    album_name: { type: String, require: true },
    album_image: { type: String, require: true },
    year: {type: Number, require: true },
    popularity: {type: Number, require: true },
    danceability: { type: Number, require: false },
    energy: { type: Number, require: false },
    key: { type: Number, require: false },
    duration_ms: { type: Number, require: true },
    time_signature: { type: Number, require: false },
    mode: { type: Number, require: false },
    loudness: { type: Number, require: false },
    speechiness: { type: Number, require: false },
    acousticness: { type: Number, require: false },
    instrumentalness: { type: Number, require: false },
    valence: { type: Number, require: false },
    tempo: { type: Number, require: false },
    liveness: { type: Number, require: false },
    liked: { type: Boolean, require: true },
    user_id: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    note: { type: Number, required: false },
});

musicRecommendedSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Recommended_Music', musicRecommendedSchema);