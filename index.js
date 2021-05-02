const mongoose = require("mongoose")
const { MONGO_URI } = require("./config")
const { Entrenamiento } = require("./models")

mongoose.connect(MONGO_URI, { useNewUrlParser: true })

const entrenamiento = new Entrenamiento({
    title: "Entrenamiento 1"
})
entrenamiento.save((err, document) => {
    if (err) console.log(err);
    console.log(document)
})

console.log(entrenamiento)
// Entrenamiento.save(entrenamiento).then(() => {
//     console.log("Se creó esa vara");
//     mongoose.disconnect();
// })
//     .catch(console.log);
