const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

mongoose.connect("mongodb://127.0.0.1/UserDéfilés", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à UserDéfilés réussie !!"))
  .catch(() => console.log("Connexion à UserDéfilés échouée !!"));



const UserSchema = mongoose.Schema({
    id_user : Number,    
    email : String,    
    password : String,    
    login : String,    
    fonction : String    
})

const Users = mongoose.model('Users', UserSchema)
module.exports = Users