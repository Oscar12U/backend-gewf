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
  let jugador = await Jugador.updateMany({}, { $set: { entrenando: false } });
  let jugador1 = await Jugador.updateMany({}, { $set: { ausente: false } });
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
    convocado: false,
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

server.post("/api/newFaltaAFavor", async (req, res) => {
  //Agregar la falta al jugador

  let jugadorActualizado = await Jugador.updateOne(
    { nombre: req.body.nombreJugador },
    { $inc: { cantFaltas: 1 } }
  );
  //Agregar la falta al partido
  let PartidoActualizado = await Partido.updateOne(
    { nombre: req.body.nombrePartido },
    { $inc: { faltasAFavor: 1 } }
  );
});

server.post("/api/newFaltaEnContra", async (req, res) => {
  //Agregar la falta al partido
  let PartidoActualizado = await Partido.updateOne(
    { nombre: req.body.nombrePartido },
    { $inc: { faltasEnContra: 1 } }
  );
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
    { nombre: req.body.anotador },
    { $inc: { cantGoles: 1 } }
  );

  let anotador = await Jugador.findOne({ nombre: req.body.anotador });

  //Obtener el jugador asistente
  let asistente = null;
  if (req.body.asistenteBool) {
    let asistenteActualizado = await Jugador.updateOne(
      { nombre: req.body.asistente },
      { $inc: { cantAsistencias: 1 } }
    );
    asistente = await Jugador.findOne({ nombre: req.body.asistente });
  }

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
  //Crear un nuevo Partido
  let jugador = await Jugador.updateMany({}, { $set: { entrenando: false } });
  let jugador1 = await Jugador.updateMany({}, { $set: { ausente: false } });

  let fechaReal = new Date(req.body.fechaPartido);
  console.log("Aqui: " + req.body.fechaPartido);
  const partido = new Partido({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    fechaPartido: fechaReal,
    cantGolesFavor: 0,
    cantGolesContra: 0,
    faltasAFavor: 0,
    faltasEnContra: 0,
    jugadores: [],
    goles: [],
    finalizado: false,
  });
  await partido.save();

  //Agregar el Partido a la temporada en especifico
  let temporadaActualizada = await Temporada.updateOne(
    { nombre: req.body.nombreTemporada },
    { $push: { partidos: partido } }
  );
  res.send(partido);
});

server.post("/api/addJugador", async (req, res) => {
  //ObtenerJugadorde

  let jugador = await Jugador.findOne({
    nombre: req.body.nombreJugador,
  });
  //Agregar el Jugador al Partido en especifico

  if (!jugador.convocado) {
    let partidoaActualizado = await Partido.updateOne(
      { nombre: req.body.nombrePartido },
      { $push: { jugadores: jugador } }
    );
    console.log("No esta convocado " + jugador.nombre);
  }

  let JugadorActualizado = await Jugador.updateOne(
    { nombre: jugador.nombre },
    { $set: { jugando: req.body.titular, convocado: true } }
  );

  res.send({ jugador });
});

server.post("/api/quitJugador", async (req, res) => {
  //ObtenerJugador

  let JugadorActualizado = await Jugador.updateOne(
    { nombre: req.body.nombreJugador },
    { $set: { jugando: false } }
  );

  res.send({ msg: "Jugador cambiado con exito" });
});

server.post("/api/removeJugadorPartido", async (req, res) => {
  //ObtenerJugador

  let JugadorActualizado = await Jugador.updateOne(
    { nombre: req.body.nombreJugador },
    { $set: { jugando: false, convocado: false } }
  );

  let jugador = await Jugador.findOne({
    nombre: req.body.nombreJugador,
  });

  let partidoaActualizado = await Partido.updateOne(
    { nombre: req.body.nombrePartido },
    { $pull: { jugadores: jugador.id } }
  );

  res.send({ msg: "Jugador eliminado con exito" });
});

server.post("/api/changeJugador", async (req, res) => {
  //ObtenerJugador

  let JugadorEntraActualizado = await Jugador.updateOne(
    { nombre: req.body.entra },
    { $set: { jugando: true } }
  );

  let JugadorSaleActualizado = await Jugador.updateOne(
    { nombre: req.body.sale },
    { $set: { jugando: false } }
  );

  res.send({ msg: "Jugador cambiado" });
});

server.post("/api/newTemporada", async (req, res) => {
  let fechaReal1 = new Date(req.body.fechaInicio);
  let fechaReal2 = new Date(req.body.fechaFin);
  //console.log("Primera Fecha" + fechaReal1);
  //console.log("Segunda Fecha" + fechaReal2);
  const temporada = new Temporada({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    fechaInicio: fechaReal1,
    fechaFin: fechaReal2,
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

server.get("/api/jugadores", async (req, res) => {
  let jugador = await Jugador.find();
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

server.post("/api/finalizarPartido", async (req, res) => {
  ////con("estoy aqui", req.body.jugador);

  //db.employee.updateMany({}, {$set: {salary: 50000}})

  let arrayTiempos = req.body.tiempos;

  arrayTiempos.map(async (tiempo) => {
    let jugadorAct = await Jugador.updateOne(
      { nombre: tiempo.nombreJugador },
      { $inc: { tiempoMinutosJuego: tiempo.tiempoMin } }
    );
  });

  let jugador = await Jugador.updateMany({}, { $set: { jugando: false } });
  let jugador1 = await Jugador.updateMany({}, { $set: { convocado: false } });

  req.body.tiempos.map(async (jugadorTimer) => {
    let jugadorUpdate = await Jugador.updateOne(
      { nombre: jugadorTimer.nombreJugador },
      { $push: { tiempoMinutosJuego: jugadorTimer.tiempoMin } }
    );
    console.log(jugadorUpdate);
  });

  let partido = await Partido.findById(req.body.partido).then((partido) => {
    ////con("todo el mae", jugador);
    partido.finalizado = true;
    partido.save().then(() => {
      res.jsonp({ partido }); // enviamos la boleta de vuelta
    });
  });
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
server.get("/api/detallesPartido/:nombrePartido", async (req, res) => {
  const { nombrePartido } = req.params;
  let partido = await Partido.findOne({
    nombre: nombrePartido,
  });
  console.log(partido);
  res.send({ data: partido });
});

server.post("/api/newLesionNombre", async (req, res) => {
  //Crear la lesion

  let fecha = new Date();

  const lesion = new Lesion({
    fechaLesion: new Date(),
    descripcion: req.body.descripcion,
  });

  await lesion.save();

  //Agregar lesion al jugador en especifico
  let jugadorActualizado = await Jugador.updateOne(
    { nombre: req.body.nombreJugador },
    { $push: { lesiones: lesion } }
  );
});

server.get("/api/ultimaTemporada", async (req, res) => {
  let temporada = await Temporada.find().sort({ $natural: -1 }).limit(1);
  console.log(temporada);
  res.send({ data: temporada });
});

server.get("/api/getAllTemporadas", async (req, res) => {
  let temporadas = await Temporada.find();
  res.send({ data: temporadas });
});

server.get("/api/getEntrenamiento/:id", async (req, res) => {
  const { id } = req.params;
  let entrenamiento = await Entrenamiento.findById(id);
  console.log(entrenamiento);

  return res.send({ error: false, data: entrenamiento });
});

server.get("/api/getPartido/:id", async (req, res) => {
  const { id } = req.params;
  let partido = await Partido.findById(id);
  console.log(partido);

  return res.send({ error: false, data: partido });
});

server.get("/api/golEspecifico/:id", async (req, res) => {
  const { id } = req.params;
  let gol = await Gol.findById(id);
  console.log(gol);

  return res.send({ error: false, data: gol });
});

server.get("/api/ausencia", async (req, res) => {
  let ausencia = await Ausencia.find();
  console.log(ausencia);
  res.send({ data: ausencia });
});

server.post("/api/agregarEntrenamientoTempo", async (req, res) => {
  //console.log("estoy aqui", req.body.jugador);

  let entranamiento = await Entrenamiento.find()
    .sort({ $natural: -1 })
    .limit(1);
  //console.log(entranamiento);
  let temporada = await Temporada.findById(req.body.temporada).then(
    (temporada) => {
      //console.log("todo el mae", jugador);
      temporada.entrenamientos.push(entranamiento[0]._id);
      temporada.save().then(() => {
        res.jsonp({ temporada }); // enviamos la boleta de vuelta
      });
    }
  );
});

server.post("/api/agregarPartidoTempo", async (req, res) => {
  //console.log("estoy aqui", req.body.jugador);

  let partido = await Partido.find().sort({ $natural: -1 }).limit(1);
  //console.log(entranamiento);
  let temporada = await Temporada.findById(req.body.temporada).then(
    (temporada) => {
      //console.log("todo el mae", jugador);
      temporada.partidos.push(partido[0]._id);
      temporada.save().then(() => {
        res.jsonp({ temporada }); // enviamos la boleta de vuelta
      });
    }
  );
});

module.exports = server;
