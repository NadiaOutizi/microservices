const express = require("express");
const Costume = require("./Costume");
const app = express();
const port = 3001;
const auth = require("../middleware/auth");
const axios = require("axios");
const amqp = require('amqplib')

app.use(express.json());

app.get("/api/costume/:id_costume", auth, async (req, res) => {
  const id_costume = req.params.id_costume;
  const costume = await Costume.findOne({ id_costume: id_costume });
  if (!costume) {
    res.status(400).json("costume not found");
  } else {
    res.status(200).json(costume);
  }
});

app.get("/api/notes_costumes/:id_costume", auth, async (req, res) => {
  const { id_costume } = req.params;

  await axios.get(`http://localhost:3002/${id_costume}`).then((response) => {
    const notes = response.data;
    const length = notes.length;
    if (length === 0) {
      res.status(400).json("there is no notes");
    } else {
      let sum = 0;
      for (let i = 0; i < length; i++) {
        sum += notes[i].valeur_note;
      }

      res.status(200).json({ moyenne: sum / length });
    }
  });
});

app.post("/api/costume", auth, (req, res) => {
  const { id_costume, designation } = req.body;
  const fonction = req.fonction;
  const nom_stylist = req.login;

  if (fonction === "styliste") {
    const newCostume = new Costume({ id_costume, designation, nom_stylist });
    newCostume
      .save()
      .then(() => res.status(200).json("creation avec success"))
      .catch(() => res.status(400).json("erreur"));
      envoyerMessageCreation()
  }
  else {
    res.status(400).json('vous etes pas un styliste')
  }
});

app.delete("/api/costume/:id_costume", auth, (req, res) => {
    const { id_costume } = req.params;
    const fonction = req.fonction;
  
    if (fonction === "styliste") {
        Costume.deleteOne({'id_costume' : id_costume})
        .then(() => res.status(200).json("objet supprimé"))
        .catch(() => res.status(400).json("erreur"));
        envoyerMessageSuppression()
    }
    else {
      res.status(400).json('vous etes pas un styliste')
    }
  });



async function envoyerMessageSuppression() {
    const amqpServer = "amqp://localhost:5876"
    var connection = amqp.connect(amqpServer)
    var canal =  connection.createChannel()
    var queue = "file_attente"
    var msg ="un costume est supprimé"
    await canal.assertQueue(queue)
    await canal.sendToQueue(queue, Buffer.from(msg))
    console.log(msg)
}

async function envoyerMessageCreation() {
    const amqpServer = "amqp://localhost:5876"
    var connection = amqp.connect(amqpServer)
    var canal =  connection.createChannel()
    var queue = "file_attente1"
    var msg ="un costume est ajouté"
    await canal.assertQueue(queue)
    await canal.sendToQueue(queue, Buffer.from(msg))
    console.log(msg)
}

  app.listen(port, ()=> console.log(`server is running in ${port}`))
