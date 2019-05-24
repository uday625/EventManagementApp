const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const authHeader = req.get('Authorization') // to gt Authorization field in the incoming request
    
    /* if not authorization header in the incoming request
        we set the isAuth (this variable can be anything, user choice) to false
        and let the user continue the operation for the allowed resolvers by
        returning Next() method  */
    if(!authHeader){
        req.isAuth = false;
        return next();
    }

    /*  if header is present for authorization, we would first extract the token
        to make sure valid token 
        the expected value would be-
        "Authorization: Bearer tokenvalue" */

    const token = authHeader.split(' ')[1];  //Bearer tokenvalue  - fetch the 2nd value

    /* if not token or token is equal to empty string */
    if(!token || token=== ''){
        req.isAuth = false;
        return next();
    }

    /* verify the token with the secret key setup and 
    we will get a decoded token. this can fail, hence 
    we will wrap it in try catch block*/

    let decodedToken;
    try{
        decodedToken = jwt.verify(token,'somesupersecretkey');
    }
    catch(err){
        req.isAuth = false;
        return next();
    }

    /* after this check we need to check if the decoded token is not set */
    if(!decodedToken){
        req.isAuth = false;
        return next();
    }

    /* if the decoded token is set  we know the token is set*/
    // req.userId - userId can be anything
    // decodedToken.userId is set in the token in login resolver
    req.isAuth = true;
    req.userId = decodedToken.userId  
    next();
}