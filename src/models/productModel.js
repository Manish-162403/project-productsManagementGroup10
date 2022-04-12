const mongoose = require("mongoose")

const productModel = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true,// mandatory, unique
    },
    description: {
        type: String,
        required: true, ///mandatory
    },
    price: {
        type: Number,
        required: true,
        //mandatory, valid number/decimal
    },
    currencyId: {
        type: String,
        required: true//mandatory, INR
    },
    currencyFormat: {
        type: String,
        required: true,
        //mandatory, Rupee symbol
    },
    isFreeShipping: {
        type: Boolean,
        default: false
    },
    productImage: {
        type: String,
        required: true,
    },  // s3 link
    style: {
        type: String
    },
    availableSizes: {
        type: String,//array of string, at least one size,
        enum: ["S", "XS", "M", "X", "L", "XXL", "XL"]
    },
    installments: {
        type: Number
    }


}, { timestamps: true })

module.exports=mongoose.model("product",productModel)