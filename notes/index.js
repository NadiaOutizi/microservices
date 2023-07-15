const express = require("express");
const Note = require("./Note");
const app = express();
const port = 3002;
const auth = require("../middleware/auth");
const axios = require("axios");
const amqp = require("amqplib");

app.use(express.json());

app.post("/api/add_note", auth, async (req, res) => {
  const { id_note, id_costume, valeur_note } = req.body;
  const fonction = req.fonction;
  const nom_membre_jury = req.login;

  if (fonction === "membre_jury") {
    const existNote = await Note.findOne({ nom_membre_jury, id_costume });
    if (!existNote && 0 < valeur_note <= 20) {
      const newNote = new Note({
        id_note,
        id_costume,
        valeur_note,
        nom_membre_jury,
      });
      newNote
        .save()
        .then(() => res.status(200).json("success"))
        .catch(() => res.status(400).json("erreur"));
        envoyerMessageCreation()
    } else {
      res.status(401).json("ghiyrha");
    }
  }
});

app.get("/api/notes/:id_costume", auth, (req, res) => {
  const { id_costume } = req.params;

  Note.find({ id_costume })
    .then((resultat) => res.status(200).json(resultat))
    .catch(() => res.status(400).json("erreur"));
});


async function envoyerMessageCreation() {
    const amqpServer = "amqp://localhost:5876"
    var connection = amqp.connect(amqpServer)
    var canal =  connection.createChannel()
    var queue = "file_attente2"
    var msg ="un note est ajouté"
    await canal.assertQueue(queue)
    await canal.sendToQueue(queue, Buffer.from(msg))
    console.log(msg)
}

app.listen(port, ()=> console.log(`server is running in ${port}`))
