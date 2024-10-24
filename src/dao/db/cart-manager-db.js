// Manager de carts MongoDB
import CartModel from "../models/cart.model.js";




class CartManager {

    // Creamos un nuevo carrito.
    async createCart(){
        try {
            // Creamos un nuevo carrito con un array de products vacio.
            const newCart = new CartModel({products: []});
            // lo guardamos con el metodo save.
            await newCart.save();
            return newCart;

        } catch (error) {
            throw error;
            return null;
            
        }
    }

    // Mostrar el carrito por id
    async getCartById(cid) {
        try {
            // Utilizamos el populate para poder mostrar el resto de los datos en el carrito.
            const cart = await CartModel.findById(cid).populate("products.product");
            
            if(!cart){
                return null;
            }
            return cart;
        } catch (error) {
            throw error;
        }
    }

    //Agrega un producto al carrito
    async addProductToCart(cid, pid, quantity = 1) {
        try {
            const cart = await this.getCartById(cid);
    
            // Convertir el pid a string para comparación
            const productExist = cart.products.find(item => item.product.toString() === pid);
    
            if (productExist) {
                // Aumentar la cantidad con el valor pasado en quantity
                productExist.quantity += quantity;
            } else {
                // Añadir el producto con la cantidad especificada
                cart.products.push({ product: pid, quantity });
            }
    
            // Marcar la propiedad "products" como modificada y luego guardarlo.
            cart.markModified("products");
            await cart.save();
            return cart;
    
        } catch (error) {
            throw error;
        }
    }

    // Actualiza solo la cantidad de un producto en un carrito
    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await this.getCartById(cid);
    
            if (!cart) {
                throw new Error("El carrito no existe.");
            }
    
            // Buscar el producto en el carrito comparando el campo `product` con `pid`
            const productExist = cart.products.find(item => item.product._id.toString() === pid);
    
            if (!productExist) {
                throw new Error("El producto no existe en el carrito.");
            }
    
            // Actualizar la cantidad del producto existente
            productExist.quantity = quantity;
    
            // Marcar la propiedad "products" como modificada y luego guardarlo.
            cart.markModified("products");
            await cart.save();
            return cart;
    
        } catch (error) {
            throw error;
        }
    }
    
    


    // Eliminar carrito
    async deleteCart(cid){
        try {
            const cart = await CartModel.findByIdAndDelete(cid);
            if(!cart) {
                return;
            }
            
        } catch (error) {
           throw error;
            
        }
    }

    
    // Eliminar un producto del carrito.
    async deleteCartProduct(cid, pid) {
        try {
            // Intenta encontrar el carrito y eliminar el producto por su Id
            const result = await CartModel.updateOne(
                // Coincide con el Id del carrito y el Id del producto dentro del carrito
                { _id: cid, "products.product": pid },
                // Elimina el producto
                { $pull: { products: { product: pid } } }
            );
    
            if (result.matchedCount === 0) {
                return false; // Devuelve false si no se encontró el producto
            } else if (result.modifiedCount === 0) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            throw error;
        }
    }
    
    

    
    // Vaciar el carrito
    async cleanCart(cid) {
        try {
            // Buscamos el carrito por Id
            const cart = await CartModel.findById(cid);
    
            if (!cart || cart.products.length === 0) {
                return null;
            }
    
            // Vaciamos el array de productos
            cart.products = [];
    
            // Guardamos  el carrito
            await cart.save();
    
            return cart;  // Devuelve el carrito vacío
    
        } catch (error) {
            throw error;
        }
    }
    
    
    // Actualizar carrito.
    async updateCart(cid, update){

      try {
        // Buscamos el carrito por su Id
        const cart = await CartModel.findById(cid);

        if(!cart) {
            return;
        }

        // Cart en su propiedad products, le pasamos la actualizacion.
        cart.products = update;

        await cart.save();

    } catch (error) {
        throw error;
    }

    }

}


export default CartManager;