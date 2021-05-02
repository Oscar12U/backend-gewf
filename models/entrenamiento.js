const mongoose = require("mongoose")
const { Schema } = mongoose;

const Entrenamiento = new Schema(
    {
        title: { type: String }
    }
);

module.exports = mongoose.model("entrenamiento", Entrenamiento);
