const express = require("express");
const User = require("./User");
const app = express();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const port = 3000;

app.use(express.json());

app.post("/api/register", async(req, res) => {
  const { id_user, email, login, password, fonction } = req.body;
  const existUser = await User.findOne({ login });
  if (existUser) {
    res.status(400).json("already exist");
  }

  const newUser = new User({ id_user, login, email, password, fonction });
  newUser
    .save()
    .then(() => res.status(200).json("success"))
    .catch(() => res.status(400).json("erreur"));
});


app.post('/api/login', async(req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email, password})
    if(!user) {
        res.status(400).json('invalid informations')
    }
    const login = user.login
    const fonction = user.fonction
    jwt.sign({login, fonction}, "RANDOM_TOKEN", {expiresIn : '2d'}, (err, token) => {
        if(err) {
            res.status(400).json('erreur lors de generation de token')
        }else {
            res.status(200).json({token : token})
        }
    })
})

app.get('/api/messages_costume', auth, (req, res) => {
    recevoirMessageCreationCostume(res)
})

app.get('/api/messages_note', auth, (req, res) => {
    recevoirMessageCreationNote(res)
})

async function recevoirMessageCreationCostume(res) {
    const amqpServer = "amqp://localhost:5876"
    var connection = amqp.connect(amqpServer)
    var canal =  connection.createChannel()
    var queue = "file_attente1"
    await canal.assertQueue(queue)
    await canal.consume(queue, (msg) => {
        res.status(200).json(msg.content.toString())
    }
    )
}

async function recevoirMessageCreationNote(res) {
    const amqpServer = "amqp://localhost:5876"
    var connection = amqp.connect(amqpServer)
    var canal =  connection.createChannel()
    var queue = "file_attente2"
    await canal.assertQueue(queue)
    await canal.consume(queue, (msg) => {
        res.status(200).json(msg.content.toString())
    }
    )
}


app.listen(port, ()=> console.log(`server is running in ${port}`))