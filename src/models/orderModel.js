const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const orderModel = new mongoose.Schema({

    
        userId: {
            type: ObjectId, 
            ref: "createUser",
            required:true
        },
        items: [{
          productId: {type: ObjectId, 
            ref: "product",
            required:true
        },
          quantity: {
              type:Number,
               required:true
            }
        }],
        totalPrice: {
            type:Number, 
            required:true
        },
        totalItems: {
            type:Number,
             required:true
            },
        totalQuantity: {
            type:Number,
             required:true
            },
        cancellable: {
            type:Boolean, 
            default: true
        },
        status: {
            type:String, 
            default: 'pending', 
            enum:["pending", "completed", "canceled"]
        },
        deletedAt: {
            type:Date
        },
        isDeleted: {
            type:Boolean, 
            default: false
        },
      
      }, { timestamps: true })

module.exports = mongoose.model("order", orderModel)