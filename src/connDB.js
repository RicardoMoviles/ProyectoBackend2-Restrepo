import mongoose from "mongoose";

export const connDB=async(url="", db="")=>{
    try {
        await mongoose.connect(
            url, 
            {
                dbName: db
            }
        ),
        console.log(`DB conectada...!!!`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
    }
}