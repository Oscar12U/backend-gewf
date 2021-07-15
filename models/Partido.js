const mongoose = require("mongoose");
const { Schema } = mongoose;

const Partido = new Schema({
  nombre: { type: String },
  descripcion: { type: String },
  cantGolesFavor: { type: Number },
  cantGolesContra: { type: Number },
  faltasAFavor: { type: Number },
  faltasEnContra: { type: Number },
  jugadores: [{ type: Schema.Types.ObjectId, ref: "jugador" }],
  goles: [{ type: Schema.Types.ObjectId, ref: "gol" }],
  fechaPartido: { type: Date },
});

module.exports = mongoose.model("partido", Partido);
