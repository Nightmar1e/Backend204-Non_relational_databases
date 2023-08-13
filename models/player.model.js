const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    playerId: String,
    playerImg: String,
    name: String,
    nationality: String,
    nationalityImg: String,
    overallRating: String,
    potentialRating: String,
    preferredPositions: [String],
    age: Number,
    team: String,
    teamImg: String,
  });
  
module.exports = mongoose.model('Player', playerSchema);
