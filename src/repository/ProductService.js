import { ProductsDAO } from "../dao/ProductsDAO.js"


class ProductService{
    constructor(dao){
        this.dao=dao
    }

    async getProducts(){
        return await this.dao.getProducts()
    }
    async getProductById(id){
        return await this.dao.getProductsById({id})
    }

    async getProductBy(filtro){
        return await this.dao.getProductBy({filtro})
    }

    async addProduct(product){
        return await this.dao.addProduct(product)
    }

    async updateProduct(id, product){
        return await this.dao.updateProduct(id, product)
    }

    async deleteProduct(product){
        return await this.dao.deleteProduct(product)
    }

}

export const productService = new ProductService(ProductsDAO)