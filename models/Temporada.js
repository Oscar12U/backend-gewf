const mongoose = require("mongoose")
const { Schema } = mongoose;

const Temporada = new Schema(
    {
        nombre: { type: String },
        descripcion: { type: String },
        fechaInicio: { type: Date },
        fechaFin: { type: Date },
        partidos: [{ type: Schema.Types.ObjectId, ref: 'partido' }],
        entrenamientos: [{ type: Schema.Types.ObjectId, ref: 'entrenamiento' }]
    }
);

module.exports = mongoose.model("temporada", Temporada);