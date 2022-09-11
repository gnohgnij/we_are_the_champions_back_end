const mongoose = require("mongoose");
const { Schema } = mongoose;

const Team = new Schema({
  name: { type: String, required: true },
  registeredDate: { type: String, required: true },
  group: { type: Number, required: true },
  points: { type: Number, required: true },
  alternatePoints: { type: Number, required: true },
  totalGoals: { type: Number, required: true },
  opponents: [{ type: String }],
});

module.exports = mongoose.model("Team", Team);
