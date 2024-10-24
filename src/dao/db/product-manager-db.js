// Manager de productos con mongoose

import ProductModel from "../models/product.model.js";



class ProductManager {


    // Crear y agregar un producto nuevo.

    async addProduct({title,description, code, price, status= true, stock, category, thumbnails }){

        try {
        // Validaciones
        // Completar datos del producto.
    if(!title || !description || !code || !price || !stock || !category) {
        console.log('Es necesario completar todos los campos');
        return;
    }

    const productExist = await ProductModel.findOne({code : code});

    if(productExist) {
        console.log("El codigo debe ser unico");
        return;
    }


    // Creamos el producto a partir del model.

    const newProduct = new ProductModel({
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    } );

    // Guardamos el producto en la DB
    await newProduct.save();

    } catch(error){
        console.log("Error al agregar un productor", error);
        return null;
    }
}


    // Metodo para obtener la lista de productos total

    async getProducts(){
        try {
            const productsArray = await ProductModel.find();
            return productsArray;
        } catch (error) {
            throw error;
        }
    }

    // Metodo para obtener un producto por id

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);

            if(!product){
                return null;
            }

            return product;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar informacion de un producto.

    async updateProduct(id, updateProduct){
        try {
            const update = await ProductModel.findByIdAndUpdate(id, updateProduct);

            if(!update){
                return null;
            }

            return update;

        } catch (error) {
            throw error;
        }
    }

    // Eliminar un producto

    async deleteProduct(id){
        try {
            const productDelete = await ProductModel.findByIdAndDelete(id);

            if(!productDelete){
                return;
            }
        } catch (error) {
            throw error;
        }
    }


}


export default ProductManager;