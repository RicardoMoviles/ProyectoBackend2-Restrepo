import { Router } from 'express';
import passport from 'passport';
import jwt from "jsonwebtoken"
import { config } from '../config/config.js';
import { passportCall } from '../utils.js';
export const router = Router()

router.get('/error', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(401).json({ error: `Error al autenticar` })
})

// paso 3:
router.post(
    "/registro",
    // passport.authenticate("registro", {session: false, failureRedirect:"/api/sessions/error"}),
    // passport.authenticate("registro", {session: false}),
    passportCall("registro"),
    (req, res) => {
        // req.user // lo deja passport.authenticate si todo sale OK
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ payload: `Registro exitoso para ${req.user.firstName}`, usuario: req.user });
    }
)

router.post(
    "/login",
    passport.authenticate("login", { session: false, failureRedirect: "/api/sessions/error" }),
    (req, res) => {
        // req.user // lo deja passport.authenticate si todo sale OK
        let token = jwt.sign(req.user, config.SECRET, { expiresIn: 3600 })
    
        res.cookie("tokenCookie", token, { httpOnly: true })
        res.setHeader('Content-Type', 'application/json');
        
        //return res.status(201).json({payload:`Login exitoso para ${req.user.nombre}`, usuarioLogueado:req.user, token});
        return res.status(201).json({ 
            payload: `Login exitoso para ${req.user.first_name}`, 
            usuarioLogueado: req.user 
        });
    }
)

router.get('/logout', (req, res) => {
    let { web } = req.query; // Obtener el parámetro 'web' de la consulta

    // Limpiar la cookie del token
    res.clearCookie('tokenCookie');

    // Si se requiere redirección, hacer eso
    if (web) {
        return res.redirect("/login?mensaje=Logout exitoso");
    }

    // Enviar respuesta JSON si no hay redirección
    res.status(200).json({ message: 'Logout exitoso' });
});