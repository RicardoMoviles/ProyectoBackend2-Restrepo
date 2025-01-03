import {Router} from 'express'
import {ProductsDAO} from "../dao/ProductsDAO.js"
import {CartsDAO} from "../dao/CartsDAO.js"
import { passportCall } from '../utils.js'
import { auth2 } from '../middleware/auth.js'


export const router = Router()

router.get('/', async (req, res) => {
    const cartId = "66e79f9222db5c70e4712aba";  // Este ID debería ser dinámico en un caso real
    try {
        const products = await ProductsDAO.getProducts();
        const cart = await CartsDAO.getCartProducts(cartId);

        if (!products || !products.payload) {
            return res.status(404).render("error", { error: "Productos o carrito no encontrado" });
        }

        let titulo = "Lista de productos"
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render("home", {
            titulo,
            title: "Home",
            products: products.payload,
            page: products.page || 1,
            totalPages: products.totalPages || 1,
            numCarts: cart.products.length || 0,
            isLogin: req.isLogin 
        });
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})

// Renderizar la vista del carrito
router.get("/cart", async (req, res) => {
    const cartId = "66e79f9222db5c70e4712aba";  // Este ID debería ser dinámico en un caso real
    try {
        const cartProducts = await CartsDAO.getCartProducts(cartId);

        if (!cartProducts || !cartProducts.products) {
            return res.status(404).render("error", { error: "Carrito no encontrado" });
        }

        res.status(200).render("cart", {
            title: "Cart",
            products: cartProducts.products,
            isLogin: req.isLogin 
        });
    } catch (error) {
        console.error("Error al cargar el carrito:", error);
        res.status(500).json({
            error: "Error en el servidor",
            detalle: error.message,
        });
    }
});

router.get('/realtimeproducts',  async (req, res) => {
    const cartId = "66e79f9222db5c70e4712aba";  // Este ID debería ser dinámico en un caso real
    let products;
    const cart = await CartsDAO.getCartProducts(cartId);
    try {
        products = await ProductsDAO.getProducts();
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }

    res.setHeader('Content-Type', 'text/html')
    res.status(200).render("realTimeProducts", {
        realEstilo: "real-styles",
        products: products,
        numCarts: cart.products.length || 0,
        isLogin: req.isLogin 
    })
})

router.get('/registro',(req,res)=>{

    res.status(200).render('registro', { isLogin: req.isLogin })
})

router.get('/login',(req,res)=>{

    res.status(200).render('login', { isLogin: req.isLogin })
})

router.get('/perfil', passportCall("current"), auth2(["admin", "USER"])  , (req,res)=>{

    let usuario=req.user

    res.status(200).render('perfil', {
        usuario, isLogin: req.isLogin
    })
})

