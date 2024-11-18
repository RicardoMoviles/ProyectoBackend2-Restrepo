import bcrypt from "bcrypt"
import passport from "passport"

export const generaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaHash=(pass, hash)=>bcrypt.compareSync(pass, hash)

export const procesaErrores=(res, error)=>{
    console.log(error);
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
        {
            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle:`${error.message}`
        }
    )
}

export const passportCall=estrategia=>function (req, res, next) {
    passport.authenticate(estrategia, function (err, user, info, status) {
        if (err) { 
            console.log("Entre a err")
            return next(err) }   // return done(error)
        if (!user) { // return done(null, false)
            console.log("Entre a !user")
            res.setHeader('Content-Type','application/json');
            return res.status(401).json({error:`${info.message?info.message:info.toString()}`})
        }  
        console.log("Entre OK")
        req.user=user;   // return done(null, usuario)
        return next()
    })(req, res, next);
}