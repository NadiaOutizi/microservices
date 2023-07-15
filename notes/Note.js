const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

mongoose.connect("mongodb://127.0.0.1/NoteDéfilés", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à NoteDéfilés réussie !!"))
  .catch(() => console.log("Connexion à NoteDéfilés échouée !!"));



const NoteSchema = mongoose.Schema({
    id_note : Number,    
    valeur_note : Number,    
    id_costume : Number,    
    nom_membre_jury : String
})

const Notes = mongoose.model('Notes', NoteSchema)
module.exports = Notes