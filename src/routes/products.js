import { Router } from "express"
import { ProductosController } from "../controller/ProductosController.js";
import { passportCall } from "../utils.js";
import { auth2 } from "../middleware/auth.js";

export const router = Router()



router.get('/', ProductosController.getProducts);

router.get('/:pid', ProductosController.getProductById);

router.post('/',passportCall("current"), auth2(["admin"]),ProductosController.addProduct);

router.put('/:pid',passportCall("current"), auth2(["admin"]),ProductosController.updateProduct);

router.delete('/:pid',passportCall("current"), auth2(["admin"]), ProductosController.deleteProduct);