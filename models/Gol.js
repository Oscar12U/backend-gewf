const mongoose = require("mongoose");
const { Schema } = mongoose;

const Gol = new Schema({
  anotador: { type: Schema.Types.ObjectId, ref: "jugador" },
  asistencia: { type: Schema.Types.ObjectId, ref: "jugador" },
  tiempoGol: { type: Number },
  periodoGol: { type: Number },
});

module.exports = mongoose.model("gol", Gol);
