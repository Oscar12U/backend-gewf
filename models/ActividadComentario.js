const mongoose = require("mongoose");
const { Schema } = mongoose;

const ActividadComentario = new Schema({
  jugador: { type: Schema.Types.ObjectId, ref: "jugador" },
  entrenamiento: { type: Schema.Types.ObjectId, ref: "entrenamiento" },
  actividad: { type: Schema.Types.ObjectId, ref: "actividad" },
  comentario: { type: String },
});

module.exports = mongoose.model("actividadComentario", ActividadComentario);
