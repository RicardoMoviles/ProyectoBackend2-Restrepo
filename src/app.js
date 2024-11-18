import express from "express"
import { engine } from "express-handlebars"
import passport from 'passport';
import cookieParser from 'cookie-parser'
import cookie from 'cookie';
import jwt from 'jsonwebtoken'; // Asegúrate de instalar jsonwebtoken

import { Server } from "socket.io"
import http from 'http'

import { router as sessionsRouter } from './routes/sessions.Router.js';
import {router as cartsRouter} from './routes/carts.js'
import {router as productsRouter} from './routes/products.js'
import {router as vistasRouter} from './routes/vistasRouter.js'
import { connDB } from './connDB.js'
import { config } from './config/config.js';

import { iniciarPassport } from './config/passport.config.js';
import { passportCall } from "./utils.js";
import { auth2 } from "./middleware/auth.js";


const PORT = config.PORT

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use((req, res, next) => {
    // Verifica si la cookie del token existe
    const token = req.cookies.tokenCookie; // Asegúrate de tener el middleware de cookies configurado
    req.isLogin = !!token; // Establece isLogin como verdadero si hay un token
    next();
});


//configurar el handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

// paso 2
iniciarPassport()
app.use(passport.initialize())


// app.use(passport.session())  // solo si usamos sessions
app.use(express.static("./src/public"))


app.use("/api/sessions", sessionsRouter)
app.use('/api/products',productsRouter)
app.use('/api/carts', cartsRouter);
app.use('/', vistasRouter)



server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})

// Middleware para leer las cookies del socket
io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || ''); // Parsear cookies
    const token = cookies.tokenCookie;  // Leer el token desde la cookie 'tokenCookie'

    if (!token) {
        return next(new Error("No token provided"));
    }

    // Verificar el token
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return next(new Error("Token is invalid"));
        }
        // Asignar el usuario decodificado al socket (esto permite que el usuario esté disponible en los eventos)
        socket.user = decoded;
        next();
    });
});


io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.user);  // Aquí tienes el usuario decodificado desde el token

    socket.on('borrarProducto', async (productId) => {
        try {
            //await ProductsManager.deleteProduct(productId);

            const url = `http://localhost:${PORT}/api/products/${productId}`
            await fetch(url, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,  // Incluimos el token en los encabezados
                    "Content-Type": "application/json"
                },
            });
        } catch (error) {
            console.error('Error deleting product via WebSocket:', error.message);
        }
    });

    socket.on('agregarProductoAlCarrito', async (productId) => {
        const cartId = "66e79f9222db5c70e4712aba";  // Este ID debería ser dinámico en un caso real
        try {
            //await ProductsManager.deleteProduct(productId);

            const url = `http://localhost:${PORT}/api/carts/${cartId}/products/${productId}`
            await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,  // Incluimos el token en los encabezados
                    "Content-Type": "application/json"
                },
            });
        } catch (error) {
            console.error('Error add product via WebSocket:', error.message);
        }
    });
});

await connDB.conectar(config.MONGO_URL, config.DB_NAME)