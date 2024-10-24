import mongoose from "mongoose";

// Utilizamos el metodo de mongoose para poder conectarnos a la DB
// El uso de then y catch para poder verificar la conexion.
const connection = mongoose.connect("mongodb+srv://LeandroA20:Sonic12345@cluster0.lxqoi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then( ()=> console.log("the device is connected sucessfully")
    )
    .catch( (error) => {
        throw error
    }
);

export default connection;