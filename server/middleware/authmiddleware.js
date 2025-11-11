const jwt = require('jsonwebtoken');



const authMiddleware = (req, res, next) =>{
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Access denied, please log in to continue"
        });
    }

    try {

       
 const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userInfo = decodedTokenInfo;

        next();
        
    } catch (error) {
         let message = "Access denied, please log in to continue";
        
        if (error.name === 'TokenExpiredError') {
            message = "Token has expired, please log in again";
        } else if (error.name === 'JsonWebTokenError') {
            message = "Invalid token, please log in again";
        }
        
        return res.status(401).json({
            success: false,
            message: message
        });
    }
}


module.exports = authMiddleware;