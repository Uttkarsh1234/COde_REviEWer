const jwt = require('jsonwebtoken');
const middle = async(req,res,next)=>{
    try{
        const token = req.cookies.token;

        const decodetoken = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = {
            userId : decodetoken.userId
        }

        next();
    }catch(error){
        return res.status(401).json({
            success: false,
            meassage: "Authentication failed"
        })
    }
}

module.exports = middle;