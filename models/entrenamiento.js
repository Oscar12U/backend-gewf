const mongoose = require("mongoose");
const { Schema } = mongoose;

const Entrenamiento = new Schema({
  nombre: { type: String },
  descripcion: { type: String },
  jugadores: [{ type: Schema.Types.ObjectId, ref: "jugador" }],
  comentarios: [String],
  actividades: [{ type: Schema.Types.ObjectId, ref: "actividad" }],
  fechaEntrenamiento: { type: Date },
  finalizado: { type: Boolean },
});

module.exports = mongoose.model("entrenamiento", Entrenamiento);
