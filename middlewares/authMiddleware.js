const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,data) => {
            if(err){
                return res.status(403).json({ message: "Forbidden: Invalid token!" });
            }
    
            req.body.userId = data.id;
            next();
        })
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            success:false,
            error,
            message:"Auth Failed"
        })
    }
}

module.exports = verifyToken