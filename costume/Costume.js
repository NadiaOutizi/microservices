const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

mongoose.connect("mongodb://127.0.0.1/ConstumeDéfilés", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à ConstumeDéfilés réussie !!"))
  .catch(() => console.log("Connexion à ConstumeDéfilés échouée !!"));



const CostumeSchema = mongoose.Schema({
    id_costume : Number,    
    designation : String,    
    nom_stylist : String,    
})

const Costumes = mongoose.model('Costumes', CostumeSchema)
module.exports = Costumes