const mongoose = require("mongoose");
const { Schema } = mongoose;

const ActividadJugador = new Schema({
  jugador: { type: Schema.Types.ObjectId, ref: "jugador" },
  entrenamiento: { type: Schema.Types.ObjectId, ref: "entrenamiento" },
  actividad: { type: Schema.Types.ObjectId, ref: "actividad" },
  minutos: { type: Number },
  segundos: { type: Number },
});

module.exports = mongoose.model("actividadJugador", ActividadJugador);
