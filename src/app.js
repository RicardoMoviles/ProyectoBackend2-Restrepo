import express from "express"
import { engine } from "express-handlebars"
import passport from 'passport';
import cookieParser from 'cookie-parser'

import { Server } from "socket.io"
import http from 'http'

import { router as sessionsRouter } from './routes/sessions.Router.js';
import {router as cartsRouter} from './routes/carts.js'
import {router as productsRouter} from './routes/products.js'
import {router as vistasRouter} from './routes/vistasRouter.js'
import { connDB } from './connDB.js'
import { config } from './config/config.js';
import { auth, auth2 } from './middleware/auth.js';
import { iniciarPassport } from './config/passport.config.js';
import { passportCall } from './utils.js';

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
app.use('/api/products', passportCall("current"), auth2(["admin", "USER"]),  productsRouter)
app.use('/api/carts', cartsRouter);
app.use('/', vistasRouter)


server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})


io.on('connection', (socket) => {
    console.log('cliente conectado');

    socket.on('borrarProducto', async (productId) => {
        try {
            //await ProductsManager.deleteProduct(productId);

            const url = `http://localhost:${PORT}/api/products/${productId}`
            await fetch(url, {
                method: "DELETE",
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
            });
        } catch (error) {
            console.error('Error add product via WebSocket:', error.message);
        }
    });
});

connDB(config.MONGO_URL, config.DB_NAME)