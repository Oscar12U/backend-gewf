const mongoose = require("mongoose")
const { Schema } = mongoose;

const Patido = new Schema(
    {
        title: { type: String },

    }
);

module.exports = mongoose.model("partido", Partido);