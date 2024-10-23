import mongoose from 'mongoose';

const cartsColl="carts"
const cartsSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products', 
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [0, 'Quantity cannot be negative']
            }
        }],
        default: []
    }
}, {
    timestamps: true,
    versionKey: false
});

// Middleware to always populate product details
cartsSchema.pre("findOne", function() {
    this.populate("products.product").lean();
});

// Register the model with a singular name

export const cartsModel=mongoose.model(
    cartsColl,
    cartsSchema
)

