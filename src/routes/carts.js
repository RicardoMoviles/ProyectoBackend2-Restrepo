import { Router } from "express"
import { CartsController } from "../controller/CartsController.js";
import { passportCall } from "../utils.js";
import { auth2 } from "../middleware/auth.js";
import passport from 'passport';
import { iniciarPassport } from '../config/passport.config.js';
export const router = Router()

// paso 2
iniciarPassport()
router.use(passport.initialize())

// Crear un nuevo carrito
router.post('/', CartsController.createCart);

// Obtener productos de un carrito por ID
router.get('/:cid', CartsController.getCart);

// Agregar un producto al carrito
router.post('/:cid/products/:pid', passportCall("current"), auth2(["USER"]), CartsController.addProductToCart);

// Eliminar producto del carrito
router.delete('/:cid/products/:pid', CartsController.deleteProductFromCart);

// Eliminar todos los productos del carrito
router.delete('/:cid', CartsController.deleteAllProducts);

// Actualiza la cantidad del producto en el carrito
router.put('/:cid/products/:pid', CartsController.updateProductQuantity);

// Actualizar todos los productos del carrito
router.put('/:cid', CartsController.updateAllCart);
