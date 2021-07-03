const mongoose = require("mongoose");
const { Schema } = mongoose;

const Jugador = new Schema({
  nombre: { type: String },
  cantGoles: { type: Number },
  cantAsistencias: { type: Number },
  tiempoMinutosJuego: { type: Number },
  cantFaltas: { type: Number },
  jugando: { type: Boolean },
  lesiones: [{ type: Schema.Types.ObjectId, ref: "lesion" }],
  activo: { type: Boolean },
  entrenando: { type: Boolean },
  ausente: { type: Boolean },
});

module.exports = mongoose.model("jugador", Jugador);
