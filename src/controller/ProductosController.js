import { procesaErrores } from "../utils.js";
import { isValidObjectId } from "mongoose"
import { productService } from "../repository/ProductService.js";

export class ProductosController {
    static async getProducts(req, res){
        const { limit, page, query, sort } = req.query;
    
        const limitNumber = Number(limit);
        const pageNumber = Number(page);
    
        if (limit && isNaN(limitNumber)) {
            return res.status(400).json({ error: "El límite debe ser un número válido" });
        }
        if (page && isNaN(pageNumber)) {
            return res.status(400).json({ error: "La página debe ser un número válido" });
        }
        
    
        try {
            const products = await  productService.getProducts(limitNumber || 10, pageNumber || 1, query, sort);
            /* if(limit){
                if (!isNaN(limit)) {
                    products = products.slice(0, parseInt(limit));
                }
                else {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(400).json({ error: `El argumento limit tiene que ser numerico` })
                }
            } */
    
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(products);
        } catch (error) {
            procesaErrores(res, error)
        }
    }

    static async getProductById(req, res){

        try {
            let { pid } = req.params
            const product = await  productService.getProductsById(pid);
            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(product);
    
        } catch (error) {
            procesaErrores(res, error)
        }
    }

    static async addProduct(req, res){

        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
    
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
    
        let existe = await  productService.getProductBy({ code })
        if (existe) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ya existe un producto con el codigo ${code}` })
        }
    
        // validar todo lo que se necesite...
        try {
            let preProducto = { title, description, code, price, status, stock, category, thumbnails }
            let productoNuevo = await  productService.addProduct(preProducto)
            req.io.emit("actualizarProductos", await  productService.getProducts())
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ productoNuevo });
        } catch (error) {
            procesaErrores(res, error)
        }
    }

    static async updateProduct(req, res){
        let { pid } = req.params
        if (!isValidObjectId(pid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `id invalido` })
        }
    
        let aModificar = { ...req.body };
        let cantPropsModificar=Object.keys(aModificar).length
        if(cantPropsModificar===0){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No se han ingresado propiedades para modificar`})
        }
    
        try {    
    
            // Eliminar el campo _id si está presente en aModificar
            if (aModificar._id) {
                delete aModificar._id;
            }
            let productoModificado = await  productService.updateProduct(pid, aModificar)
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ productoModificado });
    
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
    }

    static async deleteProduct (req, res){
        let { pid } = req.params
        if (!isValidObjectId(pid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `id invalido` })
        }
    
        try {
            await  productService.deleteProduct(pid);
            res.status(200).json({ mensaje: "Producto eliminado.", id: pid });
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
    }
}

