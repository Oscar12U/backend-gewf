const mongoose = require("mongoose")
const { Schema } = mongoose;

const Entrenamiento = new Schema(
    {
        name: { type: String },
        birthday: { type: String },
        age: { type: int }
    }
);

module.exports = mongoose.model("jugador", Jugador);
