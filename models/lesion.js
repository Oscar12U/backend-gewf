const { mongoose } = require("mongoose")
const { Schema } = mongoose;

const Lesion = new Schema(
    {
        fechaLesion: { type: Date },
        descripcion: { type: String }
    }
);

module.exports = mongoose.model("lesion", Lesion);