import { Router } from "express"
import { ProductosController } from "../controller/ProductosController.js";


export const router = Router()

router.get('/', ProductosController.getProducts);

router.get('/:pid', ProductosController.getProductById);

router.post('/', ProductosController.addProduct);

router.put('/:pid', ProductosController.updateProduct);

router.delete('/:pid', ProductosController.deleteProduct);