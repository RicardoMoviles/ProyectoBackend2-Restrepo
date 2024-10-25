import mongoose from "mongoose"

export const usuariosModel=mongoose.model(
    "usuarios",
    new mongoose.Schema(
        {
            first_name: String,
            last_name: String,
            email: {
                type: String, 
                unique: true
            },
            age: {
                type: Number,
                min: [0, 'Quantity cannot be negative']
            },
            password: {
                type: String, 
                unique: true
            },
            cart: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'cart', 
                required: false
            },
            rol: {type: String, default:"user"}
        },
        {
            timestamps:true, 
            strict: false
        }
    )
)