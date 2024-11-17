import { Router } from "express"
import {CartsDAO} from "../dao/CartsDAO.js"
import { isValidObjectId } from "mongoose"
import { CartsController } from "../controller/CartsController.js";

export const router = Router()

// Crear un nuevo carrito
router.post('/', CartsController.createCart);

// Obtener productos de un carrito por ID
router.get('/:cid', CartsController.getCart);

// Agregar un producto al carrito
router.post('/:cid/products/:pid', CartsController.addProductToCart);

// Eliminar producto del carrito
router.delete('/:cid/products/:pid', CartsController.deleteProductFromCart);

// Eliminar todos los productos del carrito
router.delete('/:cid', CartsController.deleteAllProducts);

// Actualiza la cantidad del producto en el carrito
router.put('/:cid/products/:pid', CartsController.updateProductQuantity);

// Actualizar todos los productos del carrito
router.put('/:cid', CartsController.updateAllCart);
