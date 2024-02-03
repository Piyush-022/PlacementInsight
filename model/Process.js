const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String, default: "" },
});
const processSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  bond: {
    type: Number,
    required: true,
  },
  package: {
    type: Number,
    required: true,
  },
  stipend: {
    type: Number,
    required: true,
  },
  selected: {
    type: Boolean,
    required: true,
  },
  rounds: [roundSchema],
});

module.exports = mongoose.model("Process", processSchema);
