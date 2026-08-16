const jwt=require('jsonwebtoken');
const secret="shh";

function setuser(user){
    if(!user) return null;
    else{
        let token = jwt.sign({email:user.email},secret);
        return token;
    }
}

function getuser(token){
    if(!token) return null;
    try{
        return jwt.verify(token,secret);
    }catch(error){
        return null;
    }
}

module.exports={
    setuser,
    getuser
}
