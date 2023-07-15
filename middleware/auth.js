const jwt = require('jsonwebtoken')

const verifier = function authentification (req, res, next) {
    const token = req.headers.authorization.split(' ')[1]

    jwt.verify(token, "RANDOM_TOKEN", (err, infos) => {
        if(err) {
            res.status(400).json('erreur')
        }else {
            req.fonction = infos.fonction
            req.login = infos.login
            next()
        }
    })
}

module.exports = verifier
