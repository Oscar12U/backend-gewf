const express = require("express");
const server = express();
const { Entrenamiento } = require("../models");
const cors = require("cors");

server.use(express.json());
server.use(cors());
server.get("/api/entrenamientos/", async (req, res) => {
    let entrenamiento = await Entrenamiento.find();
    console.log(entrenamiento);
    res.send({data: entrenamiento});
});

server.get("/api/entrenamientos/:id", async (req, res) => {
    const {id} = req.params;
    let entrenamiento = await Entrenamiento.findById(id);
    console.log(entrenamiento);
    
    return res.send({ error: false, data: entrenamiento});
});

server.get("/api/entrenamientos/search/:name", async (req, res) => {
     const {name} = req.params;
     let entrenamiento = await Entrenamiento.find(
         {
             title: {$regex: new RegExp(name, "i")}
         }
     );
     console.log(entrenamiento);
    
    return res.send({error: false, entrenamiento});
 });

 server.post("/api/newEntrenamiento", async (req, res) =>{
    const entrenamiento = new Entrenamiento ({
        title: req.body.title
    })

    await entrenamiento.save();
    res.send(entrenamiento);
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