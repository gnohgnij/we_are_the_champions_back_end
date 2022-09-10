const mongoose = require("mongoose");
const { Schema } = mongoose;

const Match = new Schema({
  teamA: { type: mongoose.Types.ObjectId, ref: "Team", required: true },
  teamB: { type: mongoose.Types.ObjectId, ref: "Team", required: true },
  goalsA: { type: Number, required: true },
  goalsB: { type: Number, required: true },
});

module.exports = mongoose.model("Match", Match);
