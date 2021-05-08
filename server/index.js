const express = require("express");
const server = express();
const { Entrenamiento } = require("../models");
const cors = require("cors");

server.use(express.json());
server.use(cors());
server.get("/api/entrenamientos", async (req, res) => {
    let entrenamiento = await Entrenamiento.find();
    console.log(entrenamiento);
    res.send({data: entrenamiento});
});


module.exports = server;