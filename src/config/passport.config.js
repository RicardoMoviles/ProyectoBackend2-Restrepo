import passport from "passport"
import local from "passport-local"
import github from "passport-github2"
import passportJWT from "passport-jwt"
import { UsuariosManager } from "../dao/UsuariosManager.js"
import { generaHash, validaHash } from "../utils.js"
import { config } from "./config.js"

const buscarToken=req=>{
    let token=null

    if(req.cookies.tokenCookie){
        console.log(`passport recibe token...!!!`)
        token=req.cookies.tokenCookie
    }    

    return token
}

export const iniciarPassport=()=>{

    // paso 1
    passport.use("registro", 
        new local.Strategy(
            {
                passReqToCallback: true, 
                usernameField: "email"
            },
            async(req, username, password, done)=>{
                console.log("ingresa")
                try {
                    let {first_name, last_name, age}=req.body
                    console.log(first_name)
                    if(!first_name){
                        // console.log(`Falta nombre`)
                        return done(null, false, {message:`Complete el nombre`})
                    }
                    let existe=await UsuariosManager.getBy({email:username})
                    if(existe){
                        // console.log(`existe`)
                        // console.log(existe)
                        return done(null, false, {message:`Ya existe un usuario con email ${username}`})
                    }

                    password=generaHash(password)

                    let nuevoUsuario=await UsuariosManager.addUser({first_name, last_name, email: username, age, password})
                    console.log(nuevoUsuario)
                    return done(null, nuevoUsuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use("login", 
        new local.Strategy(
            {
                usernameField:"email"
            },
            async(username, password, done)=>{
                try {
                    let usuario=await UsuariosManager.getBy({email:username})
                    console.log(usuario)
                    if(!usuario){
                        return done(null, false)
                    }
                    if(!validaHash(password, usuario.password)){
                        return done(null, false)
                    }

                    // limpiar data sensible / confidencial...
                    delete usuario.password
                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use("current", 
        new passportJWT.Strategy(
            {
                secretOrKey: config.SECRET, 
                jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([buscarToken])
            },
            async(usuario, done)=>{
                try {
                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )


    // paso 1'
    // solo si usamos sessions
    // passport.serializeUser()
    // passport.deserializeUser()


}