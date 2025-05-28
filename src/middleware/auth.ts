import {Response, NextFunction, Request} from 'express';
import jwtToken from "jsonwebtoken"

export interface AuthRequest extends Request {
  user?: any;
}

export const protectMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // 1. Get the token from headers 
        const token = req.headers.authorization?.split(" ")[1];

        // 2. If token not found 
        if(!token) {
            res.status(401).json("No token present");
            return;
        }

        // [   jwt.verify(token, secretOrPublicKey, [options, callback])   ]
        // RETURNS  : 
        /*{
            id: 'xyz456',      // your user ID or other data you signed
            iat: 1716900000,   // issued at timestamp (UNIX)
            exp: 1716986400    // expiration timestamp (UNIX)
            }
        */
        const decode = jwtToken.verify(token,process.env.JWT_SECRET!); // exclamation assures typescript that JWT_SECRET is not undefined
        req.user = decode;
        next();
    } catch (err) {
        res.status(401).json("Invalid token");
    }
}   
