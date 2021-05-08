const mongoose = require("mongoose")
const { MONGO_URI, PORT } = require("./config")
const { Entrenamiento } = require("./models")
const server = require("./server")


mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true,}).then(() => {
    server.listen(PORT, function () {
        console.log("Corriendo web server " + PORT);
    });
}).catch(console.log)






// const entrenamiento = new Entrenamiento({
//     title: "Entrenamiento 1"
// })
// entrenamiento.save((err, document) => {
//     if (err) console.log(err);
//     console.log(document)
// })

// console.log(entrenamiento)
// Entrenamiento.save(entrenamiento).then(() => {
//     console.log("Se creó esa vara");
//     mongoose.disconnect();
// })
//     .catch(console.log);
