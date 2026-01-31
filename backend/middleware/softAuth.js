import jwt from 'jsonwebtoken'


const softAuth = async (req,res,next) => {
    try {
        console.log("SoftAuth Middleware Triggered");
        let {token} = req.cookies
        
        if(!token){
             console.log("No token found in softAuth");
             return next()
        }
        let verifyToken = jwt.verify(token,process.env.JWT_SECRET)

        if(!verifyToken){
             console.log("Token verification failed in softAuth");
             return next()
        }
        req.userId = verifyToken.userId
        console.log("Token verified in softAuth, userId:", req.userId);
        next()

    } catch (error) {
         console.log("softAuth error", error);
         next()
    }
}

export default softAuth
