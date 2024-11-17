import {productsModel} from './models/productsModel.js'

export class ProductsDAO {
    constructor() { }

    static async getProducts(limit = 10, page = 1, query, sort) {
        try {
            const availability = true;  // Ejemplo de búsqueda por disponibilidad (productos disponibles)

            // Construcción del filtro
            const filter = {
                $or: [
                    // Filtro por categoría, si hay una consulta
                    query
                        ? {
                            $expr: {
                                $eq: [{ $toLower: "$category" }, query.toLowerCase()]
                            }
                        }
                        : {},

                    // Filtro por disponibilidad
                    availability !== undefined
                        ? { status: availability }
                        : {}
                ]
            };

            // Construcción del objeto de ordenamiento
            const sorting = sort ? { price: sort === "asc" ? 1 : -1 } : {};

            // Ejecución de la consulta con paginación
            const response = await productsModel.paginate(filter, {
                lean: true,
                limit,
                page,
                sort: sorting
            });


            return {
                status: response ? "success" : "error",
                payload: response.docs,
                totalPages: response.totalPages,
                prevPage: response.prevPage,
                nextPage: response.nextPage,
                page: response.page,
                hasPrevPage: response.hasPrevPage,
                hasNextPage: response.hasNextPage,
                prevLink: response.hasPrevPage
                    ? `/api/products?limit=${limit}&page=${response.prevPage}`
                    : null,
                nextLink: response.hasNextPage
                    ? `/api/products?limit=${limit}&page=${response.nextPage}`
                    : null,
            };
        } catch (error) {
            console.error("Error al obtener productos:", error);
            throw new Error("No se pudieron obtener los productos.");
        }
    }

    // Obtener un producto por su ID
    static async getProductsById(productId) {
        try {
            const product = await productsModel.findOne({ _id: productId }).lean();
            if (!product) throw new Error("Producto no encontrado.");
            return product;
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            throw new Error("Error al obtener el producto por ID.");
        }
    }

    static async getProductBy(filtro={}){  
        return await productsModel.findOne(filtro)
    }

    static async addProduct(nuevoProducto) {
        try {
            return await productsModel.create(nuevoProducto);
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            throw new Error("No se pudo agregar el producto.");
        }
    }

    static async updateProduct(id, aModificar) {
        // Asegúrate de que _id no esté en los datos a modificar
        if (aModificar._id) {
            throw new Error('No se puede modificar el campo _id');
        }
        try {
            const result = await productsModel.findByIdAndUpdate(
                id,
                aModificar,
                { new: true }
            );
            if (!result) throw new Error("Producto no encontrado para actualizar.");
            return result;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw new Error("No se pudo actualizar el producto.");
        }
    }

    static async deleteProduct(id) {
        try {
            const deletedProduct = await productsModel.findByIdAndDelete(id);
            if (!deletedProduct) throw new Error("Producto no encontrado.");
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw new Error("No se pudo eliminar el producto.");
        }
    }
}