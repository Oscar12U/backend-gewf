const mongoose = require("mongoose");
const { Schema } = mongoose;

const Ausencia = new Schema({
  jugador: { type: Schema.Types.ObjectId, ref: "jugador" },
  entrenamiento: { type: Schema.Types.ObjectId, ref: "entrenamiento" },
  justificada: { type: Boolean },
  injustificada: { type: Boolean },
});

module.exports = mongoose.model("ausencia", Ausencia);
