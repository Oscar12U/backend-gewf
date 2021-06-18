const express = require("express");
const server = express();
const {
  Entrenamiento,
  Lesion,
  Jugador,
  Actividad,
  Gol,
  Partido,
  Temporada,
} = require("../models");
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
  let entrenamiento = await Entrenamiento.find({
    title: { $regex: new RegExp(name, "i") },
  });
  console.log(entrenamiento);

  return res.send({ error: false, entrenamiento });
});

server.post("/api/newEntrenamiento", async (req, res) => {
  const entrenamiento = new Entrenamiento({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    jugadores: req.body.jugadores,
    comentarios: req.body.comentarios,
    actividades: req.body.actividades,
    fechaEntrenamiento: req.body.fechaEntrenamiento,
  });

  await entrenamiento.save();
  res.send(entrenamiento);
});

server.post("/api/newLesion", async (req, res) => {
  const lesion = new Lesion({
    fechaLesion: req.body.fechaLesion,
    descripcion: req.body.descripcion,
  });

  await lesion.save();
  res.send(lesion);
});

server.post("/api/newJugador", async (req, res) => {
  const jugador = new Jugador({
    nombre: req.body.nombre,
    cantGoles: req.body.cantGoles,
    cantAsistencias: req.body.cantAsistencias,
    tiempoMinutosJuego: req.body.tiempoMinutosJuego,
    cantFaltas: req.body.cantFaltas,
    jugando: req.body.jugando,
    lesiones: req.body.lesiones,
    activo: req.body.activo
  });
  await jugador.save();
  res.send(jugador);
});

server.post("/api/newActividad", async (req, res) => {
  const actividad = new Actividad({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    tiempoMinutos: req.body.tiempoMinutos,
  });
  await actividad.save();
  res.send(actividad);
});

server.post("/api/updateActividad/:nombre", async (req, res) => {
  const { id } = req.params;
  let actividad = await Actividad.findOne({
    nombre: req.params.nombre,
  }).then((actividad) => {
    actividad.nombre = "Hola soy una prueba";
    actividad.save().then(() => {
      res.jsonp({ actividad }); // enviamos la boleta de vuelta
    });
  });
});

server.get("/api/searchActividad/:id", async (req, res) => {
  const { id } = req.params;
  let actividad = await Actividad.findById(id);
  console.log(actividad);

  return res.send({ error: false, data: actividad });
});

server.get("/api/jugador/:id", async (req, res) => {
  const { id } = req.params;
  let jugador = await Jugador.findById(id);
  console.log(jugador);

  return res.send({ error: false, data: jugador });
});

server.post("/api/newGol", async (req, res) => {
  let anotadorActualizado = await Jugador.updateOne(
    { _id: req.body.anotador },
    { $inc: { cantGoles: 1 } }
  );

  let anotador = await Jugador.findById(req.body.anotador);

  //Obtener el jugador asistente

  let asistenteActualizado = await Jugador.updateOne(
    { _id: req.body.asistente },
    { $inc: { cantAsistencias: 1 } }
  );
  let asistente = await Jugador.findById(req.body.asistente);

  // Crear Gol
  const gol = new Gol({
    anotador: anotador,
    asistencia: asistente,
    tiempoGol: req.body.tiempoGol,
    periodoGol: req.body.periodoGol,
  });

  await gol.save();

  //Agregar el gol al partido especifico

  let partidoActualizado = await Partido.updateOne(
    { nombre: req.body.nombrePartido },
    { $push: { goles: gol } }
  );
});

server.post("/api/newPartido", async (req, res) => {
  const partido = new Partido({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    fechaPartido: req.body.fechaPartido,
  });
  await partido.save();
  res.send(partido);
});

server.post("/api/newTemporada", async (req, res) => {
  const temporada = new Temporada({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    fechainicio: req.body.fechainicio,
    fechaFin: req.body.fechaFin,
    partidos: req.body.partidos,
    entrenamientos: req.body.entrenamientos,
  });
  await temporada.save();
  res.send(temporada);
});

//Esto es una prueba de borrar => No se recomienda usar porque puede dar problemas
server.post("/api/deleteJugador/:nombre", async (req, res) => {
  const { nombre } = req.params;
  let jugador = await Jugador.findOneAndDelete(nombre);
  console.log(jugador);

  return res.send({ error: false, data: jugador });
});

//  router.post("/posts", async (req, res) => {
// 	const post = new Post({
// 		title: req.body.title,
// 		content: req.body.content,
// 	})
// 	await post.save()
// 	res.send(post)
// })

server.get("/api/jugadores/", async (req, res) => {
  let jugador = await Jugador.find();
  console.log(jugador);
  res.send({ data: jugador });
});

module.exports = server;
