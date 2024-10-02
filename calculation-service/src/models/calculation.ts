const mongoose = require("mongoose");

const calculationSchema = new mongoose.Schema({
  kafkaKey: {
    type: Number,
    required: true,
    unique: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  calculationResult: {
    type: Number,
  },
});

export default mongoose.model("Calculation", calculationSchema);
