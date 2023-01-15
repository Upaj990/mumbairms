var jwt = require('jsonwebtoken');
var tokenelemtns = {
    "Secret":"userSecretData",
    "Life":31500000
};

module.exports = (req,res,next) =>{
    const token = req.headers['authorization']
    if(token){
        jwt.verify( token,tokenelemtns.Secret,(err,decoded)=>{
            if(err){
                return res
                .status(401)
                .json({"status":false,
                "message":"Unauthorized  " + err})
            }
            req.decoded = decoded
            next()
        })
    }
    else{
        return res.status(403).send({
            "error":true,
            "message":"No TOken Found"
        });
    }
}