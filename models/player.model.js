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
  height: String,
  weight: String,
  preferredFoot: String,
  birthDate: String,
  playerWorkRate: String,
  weakFoot: Number,
  skillMoves: Number,
  valueEuro: String,
  valueDollar: String,
  valuePound: String,
  wageEuro: String,
  wageDollar: String,
  wagePound: String,
  });
  
module.exports = mongoose.model('Player', playerSchema);
