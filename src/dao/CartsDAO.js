import fs from 'fs'
//const { v4: uuidv4 } = require('uuid');
import path from 'path';
import {cartsModel} from './models/cartsModel.js'
import {productsModel} from './models/productsModel.js'

const cartsFilePath = path.resolve('src/data/carts.json');

export class CartsDAO {
    constructor() { }

/*     static async getCarts() {
        if (fs.existsSync(cartsFilePath)) {
            return JSON.parse(await fs.promises.readFile(cartsFilePath, 'utf-8'));
        } else {
            return [];
        }
    } */

    static async addCart() {
        try {
            const newCart = { products: [] };
            return await cartsModel.create(newCart);
        } catch (error) {
            console.error("Error al crear el carrito: ", error);
            throw new Error("No se pudo agregar el carrito");
        }
    }

    static async getCartProducts(cartId) {
        try {
            const cart = await cartsModel.findById(cartId).populate("products.product").lean();
            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }
            return cart;
        } catch (error) {
            console.error("Error al obtener los productos del carrito:", error);
            throw new Error("Error al obtener los productos del carrito.");
        }
    }

    static async addProductToCart(cartId, productId) {

        const carts = await cartsModel.findOne({ _id: cartId }).lean();
        if (!carts) {
            throw new Error(`Cart with id ${cartId} not found.`);
        }

        const product = await productsModel.findOne({ _id: productId }).lean();
        if (!product) {
            throw new Error("Producto no encontrado.");
        }

        // Verifica si el producto ya está en el carrito
        const productIndex = await cartsModel.findOne({
            _id: cartId,
            "products.product": productId,
        }).lean();

        if (productIndex) {
            return await cartsModel.updateOne(
                { _id: cartId, "products.product": productId },
                { $inc: { "products.$.quantity": 1 } }
            );
        } else {
            return await cartsModel.updateOne(
                { _id: cartId },
                { $push: { products: { product: productId, quantity: 1 } } }
            );
        }
    }

    static async deleteProductFromCart(cartId, productId) {
        try {
            return await cartsModel.updateOne(
                { _id: cartId },
                { $pull: { products: { product: productId } } }
            );
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            throw new Error("Error al eliminar producto del carrito.");
        }
    }

    
    static async deleteAllProducts(cartId) {
        try {
            return await cartsModel.updateOne(
                { _id: cartId },
                { $set: { products: [] } }
            );
        } catch (error) {
            console.error("Error al eliminar todos los productos del carrito:", error);
            throw new Error("Error al eliminar todos los productos del carrito.");
        }
    }

    static async updateProductQuantity(cartId, productId, quantity) {
        try {
            return await cartsModel.updateOne(
                { _id: cartId, "products.product": productId },
                { $set: { "products.$.quantity": quantity } }
            );
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            throw new Error("Error al actualizar la cantidad del producto en el carrito.");
        }
    }

    static async updateAllCart(cartId, products) {
        try {
            await cartsModel.updateOne(
                { _id: cartId },
                { $set: { products } }
            );
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            throw new Error("Error al actualizar el carrito.");
        }
    }
}