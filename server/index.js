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
  ActividadJugador,
  ActividadComentario,
  Ausencia,
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
    jugadores: [],
    comentarios: [],
    actividades: [],
    fechaEntrenamiento: new Date(),
    finalizado: false,
  });

  await entrenamiento.save();
  res.send(entrenamiento);
});

// server.post("/api/newLesion", async (req, res) => {
//   const lesion = new Lesion({
//     fechaLesion: req.body.fechaLesion,
//     descripcion: req.body.descripcion,
//   });

//   await lesion.save();
//   res.send(lesion);
// });

server.get("/api/lesion/:id", async (req, res) => {
  const { id } = req.params;
  let lesion = await Lesion.findById(id);
  console.log(lesion);

  return res.send({ error: false, data: lesion });
});

server.post("/api/newJugador", async (req, res) => {
  const jugador = new Jugador({
    nombre: req.body.nombre,
    cantGoles: 0,
    cantAsistencias: 0,
    tiempoMinutosJuego: 0,
    cantFaltas: 0,
    jugando: false,
    lesiones: [],
    activo: true,
    entrenando: false,
    ausente: false,
  });
  await jugador.save();
  res.send(jugador);
});

server.post("/api/newAusencia", async (req, res) => {
  const ausencia = new Ausencia({
    jugador: req.body.jugador,
    entrenamiento: req.body.entrenamiento,
    justificada: req.body.justificada,
    injustificada: req.body.injustificada,
  });
  await ausencia.save();
  res.send(ausencia);
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

server.post("/api/newGolContra", async (req, res) => {
  //Agregar el gol en contra al partido especifico

  let partidoActualizado = await Partido.updateOne(
    { nombre: req.body.nombrePartido },
    { $inc: { cantGolesContra: 1 } }
  );
});

server.post("/api/newGolFavor", async (req, res) => {
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
    { $push: { goles: gol }, $inc: { cantGolesFavor: 1 } }
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
server.post("/api/deleteJugador", async (req, res) => {
  //console.log("estoy aqui", req.body.jugador);
  let jugador = await Jugador.findById(req.body.jugador).then((jugador) => {
    //console.log("todo el mae", jugador);
    jugador.activo = false;
    jugador.save().then(() => {
      res.jsonp({ jugador }); // enviamos la boleta de vuelta
    });
  });

  // const { nombre } = req.params;
  // let jugador = await Jugador.findOneAndDelete(nombre);
  // console.log(jugador);

  // return res.send({ error: false, data: jugador });
});

server.post("/api/entrenandoJugador", async (req, res) => {
  //console.log("estoy aqui", req.body.jugador);
  let jugador = await Jugador.findById(req.body.jugador).then((jugador) => {
    //console.log("todo el mae", jugador);
    jugador.entrenando = true;
    jugador.save().then(() => {
      res.jsonp({ jugador }); // enviamos la boleta de vuelta
    });
  });

  // const { nombre } = req.params;
  // let jugador = await Jugador.findOneAndDelete(nombre);
  // console.log(jugador);

  // return res.send({ error: false, data: jugador });
});

server.post("/api/ausenteJugador", async (req, res) => {
  let jugador = await Jugador.findById(req.body.jugador).then((jugador) => {
    jugador.ausente = true;
    jugador.save().then(() => {
      res.jsonp({ jugador }); // enviamos la boleta de vuelta
    });
  });
});

server.post("/api/agregarJugadorPartido", async (req, res) => {
  //console.log("estoy aqui", req.body.jugador);
  let entranamiento = await Entrenamiento.findById(req.body.entrenamiento).then(
    (entranamiento) => {
      //console.log("todo el mae", jugador);
      entranamiento.jugadores.push(req.body.jugador);
      entranamiento.save().then(() => {
        res.jsonp({ entranamiento }); // enviamos la boleta de vuelta
      });
    }
  );

  // const { nombre } = req.params;
  // let jugador = await Jugador.findOneAndDelete(nombre);
  // console.log(jugador);

  // return res.send({ error: false, data: jugador });
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

server.get("/api/actividad/:id", async (req, res) => {
  const { id } = req.params;
  let actividad = await Actividad.findById(id);
  console.log(actividad);

  return res.send({ error: false, data: actividad });
});

server.post("/api/newActividadJugador", async (req, res) => {
  const actividadJugador = new ActividadJugador({
    jugador: req.body.jugador,
    entrenamiento: req.body.entrenamiento,
    actividad: req.body.actividad,
    minutos: req.body.minutos,
    segundos: req.body.segundos,
  });

  await actividadJugador.save();
  res.send(actividadJugador);
});

server.post("/api/newActividadComentario", async (req, res) => {
  const actividadComentario = new ActividadComentario({
    jugador: req.body.jugador,
    entrenamiento: req.body.entrenamiento,
    actividad: req.body.actividad,
    comentario: req.body.comentario,
  });
  await actividadComentario.save();
  res.send(actividadComentario);
});

server.post("/api/newLesion", async (req, res) => {
  //Crear la lesion

  let fecha = new Date();

  const lesion = new Lesion({
    fechaLesion: new Date(),
    descripcion: req.body.descripcion,
  });

  await lesion.save();

  //Agregar lesion al jugador en especifico
  let jugadorActualizado = await Jugador.updateOne(
    { _id: req.body.jugador },
    { $push: { lesiones: lesion } }
  );
  res.send(jugadorActualizado);
  // let jugadorActualizado = await Jugador.findById(req.body.jugador).then(
  //   (jugador) => {
  //     //console.log("todo el mae", jugador);
  //     jugador.lesiones.push(lesion);
  //     jugador.save().then(() => {
  //       res.jsonp({ jugador }); // enviamos la boleta de vuelta
  //     });
  //   }
  // );

  //return res.send({ lesion });
});

server.post("/api/agregarComentario", async (req, res) => {
  //console.log("estoy aqui", req.body.jugador);
  let entranamiento = await Entrenamiento.findById(req.body.entrenamiento).then(
    (entranamiento) => {
      //console.log("todo el mae", jugador);
      entranamiento.comentarios.push(req.body.comentario);
      entranamiento.save().then(() => {
        res.jsonp({ entranamiento }); // enviamos la boleta de vuelta
      });
    }
  );
});

server.post("/api/finalizarEntrentramiento", async (req, res) => {
  //console.log("estoy aqui", req.body.jugador);

  //db.employee.updateMany({}, {$set: {salary: 50000}})

  let jugador = await Jugador.updateMany({}, { $set: { entrenando: false } });
  let jugador1 = await Jugador.updateMany({}, { $set: { ausente: false } });

  let entranamiento = await Entrenamiento.findById(req.body.entrenamiento).then(
    (entranamiento) => {
      //console.log("todo el mae", jugador);
      entranamiento.finalizado = true;
      entranamiento.save().then(() => {
        res.jsonp({ entranamiento }); // enviamos la boleta de vuelta
      });
    }
  );
});

server.get("/api/ultimoEntrenamiento", async (req, res) => {
  let entranamiento = await Entrenamiento.find()
    .sort({ $natural: -1 })
    .limit(1);
  console.log(entranamiento);
  res.send({ data: entranamiento });
});

server.get("/api/actividades", async (req, res) => {
  let actividad = await Actividad.find();
  console.log(actividad);
  res.send({ data: actividad });
});

server.post("/api/agregarActividadEntrenamiento", async (req, res) => {
  let entranamiento = await Entrenamiento.findById(req.body.entrenamiento).then(
    (entranamiento) => {
      //console.log("todo el mae", jugador);
      entranamiento.actividades.push(req.body.actividad);
      entranamiento.save().then(() => {
        res.jsonp({ entranamiento }); // enviamos la boleta de vuelta
      });
    }
  );
});

module.exports = server;
