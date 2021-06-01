const mongoose = require("mongoose");
const { Schema } = mongoose;

const Actividad = new Schema({
  nombre: { type: String },
  descripcion: { type: String },
  tiempoMinutos: { type: Number },
});

module.exports = mongoose.model("actividad", Actividad);
