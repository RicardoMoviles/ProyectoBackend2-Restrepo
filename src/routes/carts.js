import { Router } from "express"
import {CartsManager} from "../dao/CartsManager.js"
import { isValidObjectId } from "mongoose"

export const router = Router()

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await CartsManager.addCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error creating cart' });
    }
});

// Obtener productos de un carrito por ID
router.get('/:cid', async (req, res) => {
    let { cid } = req.params;

    if (!isValidObjectId(cid)) {
        return res.status(400).json({ message: "ID de carrito inválido" });
    }
    try {
        const cart = await CartsManager.getCartProducts(cid);
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `Cart con id ${cid} no encontrado` })
        }
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(cart)
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
});

// Agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        let cartId = req.params.cid;
        let productId = req.params.pid;

        if (!cartId || !productId) {
            return res.status(400).json({ error: "Faltan parámetros obligatorios" });
        }

        if (!isValidObjectId(cartId) || !isValidObjectId(productId)) {
            return res.status(400).json({ message: "ID de carrito o producto inválido" });
        }

        const result = await CartsManager.addProductToCart(cartId, productId);
        res.status(200).json(result);
    } catch (error) {
        if (error.message.includes('Cart with id')) {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Product with id')) {
            return res.status(404).json({ error: error.message });
        }
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error adding product to cart`,
                detalle: `${error.message}`
            }
        )
    }
});

// Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        let cartId = req.params.cid;
        let productId = req.params.pid;

        if (!cartId || !productId) {
            return res.status(400).json({ error: "Faltan parámetros obligatorios" });
        }

        if (!isValidObjectId(cartId) || !isValidObjectId(productId)) {
            return res.status(400).json({ message: "ID de carrito o producto inválido" });
        }

        await CartsManager.deleteProductFromCart(cartId, productId);
        res.status(200).json({ message: "Producto eliminado del carrito" });
    } catch (error) {
        if (error.message.includes('Cart with id')) {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Product with id')) {
            return res.status(404).json({ error: error.message });
        }
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error adding product to cart`,
                detalle: `${error.message}`
            }
        )
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    let cartId = req.params.cid;

    if (!cartId) {
        return res.status(400).json({ error: "Faltan parámetros obligatorios" });
    }

    if (!isValidObjectId(cartId)) {
        return res.status(400).json({ message: "ID de carrito inválido" });
    }

    try {
        await CartsManager.deleteAllProducts(cartId);
        res.status(200).json({ message: "Todos los productos han sido eliminados de carrito" });
    } catch (error) {
        console.log("Error al eliminar los productos del carrito");
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )

    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    const { quantity } = req.body;

    if (!cartId || !productId) {
        return res.status(400).json({ error: "Faltan parámetros obligatorios" });
    }

    if (!isValidObjectId(cartId) || !isValidObjectId(productId)) {
        return res.status(400).json({ message: "ID de carrito o producto inválido" });
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
    }

    try {
        // Actualiza la cantidad del producto en el carrito
        await CartsManager.updateProductQuantity(cartId, productId, quantity);
        res.status(200).json({ message: 'Cantidad actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad', detalle: error.message });
    }
});

// Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    let cartId = req.params.cid;
    const { products } = req.body;
    console.log(products)

    if (!cartId || !products) {
        return res.status(400).json({ error: "Faltan parámetros obligatorios" });
    }

    if (!isValidObjectId(cartId)) {
        return res.status(400).json({ message: "ID de carrito inválido" });
    }

    let cantPropsModificar=Object.keys(products).length
    if(cantPropsModificar===0){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`No se han ingresado propiedades para modificar`})
    }

    try {
        await CartsManager.updateAllCart(cartId, products);
        res.status(200).json({ message: "Carrito actualizado exitosamente" });
    } catch (error) {
        console.log("Error al eliminar los productos del carrito");
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )

    }
});
