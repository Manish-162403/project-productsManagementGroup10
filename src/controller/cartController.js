const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const mongoose = require('mongoose')



const isValid = function (value) {
    if (typeof value === undefined || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'Number' && value.trim().length === 0) return false
    return true;
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const addtocart =async function(req,res){
   
    let user = req.params.userId
    let data = req.body

  //  let items = JSON.parse(data.items)

if(!isValidObjectId(user)){return res.status(400).send({status:false, msg:"please input user"})}


let {userId, totalPrice,items,totalItems} = data

// data.items = items

let checkProduct =await productModel.findOne({_id:items.productId,isDeleted:false})

if(!isValidObjectId(checkProduct)){return res.status(400).send({status:false, msg:"product is not available"})}

if(!checkProduct){return res.status(404).send({status:false, msg:"product not found"})}

if(!isValid(items.quantity)){return res.status(400).send({status:false, msg:"please enter quantity"})}

  quantity = items.quantity

let increasedQuantity = await cartModel.findOneAndUpdate({ userId:user, isDeleted: false }, { $inc: { quantity: 1} }, { new: true })

if(!isValid(totalPrice)){return res.status(400).send({status:false, msg:"totalprice required"})}

let finalPrice = await cartModel.findOne({_id:userId,isDeleted:false}).select({totalPrice:1})

let increasedprice = await cartModel.findOneAndUpdate({ userId:user, isDeleted: false }, { $inc: { totalPrice: data.totalPrice += finalPrice } }, { new: true })


if(!isValid(totalItems)){return res.status(400).send({status:false, msg:"totalItems required"})}

let increasedItem = await cartModel.findOneAndUpdate({ userId:user, isDeleted: false }, { $inc: { totalItems: 1 } }, { new: true })


if(!isValidObjectId(userId)){return res.status(400).send({status:false, msg:"please input valid user"})}

let checkuser = await userModel.findOne({_id:userId,isDeleted:false})

if(!checkuser){return res.status(404).send({status:false, msg:"User not found"})}

let savedData = await cartModel.create(data)

return res.status(201).send({msg:savedData})


}


module.exports.addtocart=addtocart