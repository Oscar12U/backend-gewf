const express = require("express");
const server = express();
const { Entrenamiento, Lesion, Jugador } = require("../models");
const cors = require("cors");

server.use(express.json());
server.use(cors());
server.get("/api/entrenamientos/", async (req, res) => {
    let entrenamiento = await Entrenamiento.find();
    console.log(entrenamiento);
    res.send({ data: entrenamiento });
});

server.get("/api/entrenamientos/:id", async (req, res) => {
    const { id } = req.params;
    let entrenamiento = await Entrenamiento.findById(id);
    console.log(entrenamiento);

    return res.send({ error: false, data: entrenamiento });
});

server.get("/api/entrenamientos/search/:name", async (req, res) => {
    const { name } = req.params;
    let entrenamiento = await Entrenamiento.find(
        {
            title: { $regex: new RegExp(name, "i") }
        }
    );
    console.log(entrenamiento);

    return res.send({ error: false, entrenamiento });
});

server.post("/api/newEntrenamiento", async (req, res) => {
    const entrenamiento = new Entrenamiento({
        title: req.body.title
    })

    await entrenamiento.save();
    res.send(entrenamiento);
})

server.post("/api/newLesion", async (req, res) => {
    const lesion = new Lesion({
        fechaLesion: req.body.fechaLesion,
        descripcion: req.body.descripcion
    })

    await lesion.save();
    res.send(lesion);
})

server.post("/api/newJugador", async (req, res) => {
    const jugador = new Jugador({
        nombre: req.body.nombre,
        cantGoles: req.body.cantGoles,
        cantAsistencias: req.body.cantAsistencias,
        tiempoMinutosJuego: req.body.tiempoMinutosJuego,
        cantFaltas: req.body.cantFaltas,
        jugando: req.body.jugando,
        lesiones: req.body.lesiones
    })
    await jugador.save();
    res.send(jugador);
})

// server.get("/api/entrenamientos/:id", async (req, res) => {
//     const { id } = req.params;
//     let entrenamiento = await Entrenamiento.findById(id);
//     console.log(entrenamiento);

//     return res.send({ error: false, data: entrenamiento });
// });

server.get("/api/jugador/:id", async (req, res) => {
    const { id } = req.params;
    let jugador = await Jugador.findById(id);
    console.log(jugador);

    return res.send({ error: false, data: jugador });
})

//  router.post("/posts", async (req, res) => {
// 	const post = new Post({
// 		title: req.body.title,
// 		content: req.body.content,
// 	})
// 	await post.save()
// 	res.send(post)
// })


module.exports = server;