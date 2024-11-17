import { CartsDAO } from "../dao/CartsDAO.js";
import { isValidObjectId } from "mongoose"
import { procesaErrores } from "../utils.js";

export class CartsController {
    static async createCart (req, res) {
        try {
            const newCart = await CartsDAO.addCart();
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ error: 'Error creating cart' });
        }
    }

    static async getCart (req, res) {
        let { cid } = req.params;
    
        if (!isValidObjectId(cid)) {
            return res.status(400).json({ message: "ID de carrito inválido" });
        }
        try {
            const cart = await CartsDAO.getCartProducts(cid);
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ error: `Cart con id ${cid} no encontrado` })
            }
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(cart)
        } catch (error) {
            procesaErrores(res, error)
        }
    }

    static async addProductToCart (req, res){
        try {
            let cartId = req.params.cid;
            let productId = req.params.pid;
    
            if (!cartId || !productId) {
                return res.status(400).json({ error: "Faltan parámetros obligatorios" });
            }
    
            if (!isValidObjectId(cartId) || !isValidObjectId(productId)) {
                return res.status(400).json({ message: "ID de carrito o producto inválido" });
            }
    
            const result = await CartsDAO.addProductToCart(cartId, productId);
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
    }

    static async deleteProductFromCart(req, res){
        try {
            let cartId = req.params.cid;
            let productId = req.params.pid;
    
            if (!cartId || !productId) {
                return res.status(400).json({ error: "Faltan parámetros obligatorios" });
            }
    
            if (!isValidObjectId(cartId) || !isValidObjectId(productId)) {
                return res.status(400).json({ message: "ID de carrito o producto inválido" });
            }
    
            await CartsDAO.deleteProductFromCart(cartId, productId);
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
    }

    static async deleteAllProducts(req, res) {
        let cartId = req.params.cid;
    
        if (!cartId) {
            return res.status(400).json({ error: "Faltan parámetros obligatorios" });
        }
    
        if (!isValidObjectId(cartId)) {
            return res.status(400).json({ message: "ID de carrito inválido" });
        }
    
        try {
            await CartsDAO.deleteAllProducts(cartId);
            res.status(200).json({ message: "Todos los productos han sido eliminados de carrito" });
        } catch (error) {
            procesaErrores(res, error)
        }
    }

    static async updateProductQuantity(req, res){
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
            await CartsDAO.updateProductQuantity(cartId, productId, quantity);
            res.status(200).json({ message: 'Cantidad actualizada correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la cantidad', detalle: error.message });
        }
    }

    static async updateAllCart(req, res) {
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
            await CartsDAO.updateAllCart(cartId, products);
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
    }
}

