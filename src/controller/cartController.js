const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const objectId = require('mongoose').Types.ObjectId


const isValid = function (value) {
    if (typeof value === undefined || value === null) return false
    if ((typeof value === 'String' || typeof value === Number)  && value.trim().length === 0) return false
    return true;
}

const addtocart = async function (req, res) {
  try{ 
       let data = req.body;
    if (Object.keys(data) == 0) { return res.status(400).send({ status: false, message: "Please provide input " }) }

    let cId = data.cartId;
    let pId = data.productId;
  
    if (!pId) { return res.status(400).send({ status: false, message: "Please provide Product Id " }) }

    let uId = req.params.userId;
    if (Object.keys(uId) == 0) { return res.status(400).send({ status: false, message: "Please provide User Id " }) }

    let userExist = await userModel.findOne({ _id: uId });
    if (!userExist) {
        return res.status(404).send({ status: false, message: `No user found with this ${uId}` })
    }

    let cartExist = await cartModel.findOne({ _id: cId });
    if (cartExist) {
        if (cartExist.userId != uId) {
            return res.status(403).send({ status: false, message: "This cart does not belong to you. Please check the cart Id" })
        }
        let updateData = {}

        for (let i = 0; i < cartExist.items.length; i++) {
            if (cartExist.items[i].productId == pId) {
                cartExist.items[i].quantity = cartExist.items[i].quantity + 1;

                updateData['items'] = cartExist.items
                const productPrice = await productModel.findOne({ _id: pId, isDeleted: false }).select({ price: 1, _id: 0 })

                if (!productPrice) { 
                    return res.status(404).send({ status: false, message: `No product found with this ${pId}` }) 
                }

                nPrice = productPrice.price;
                updateData['totalPrice'] = cartExist.totalPrice + (nPrice * 1)
                updateData['totalItems'] = cartExist.items.length;

                const updatedCart = await cartModel.findOneAndUpdate({ _id: cId }, updateData, { new: true })
                return res.status(200).send({ status: true, message: "Updated Cart", data: updatedCart })
            }
            if (cartExist.items[i].productId !== pId && i == cartExist.items.length - 1) {
                const obj = { productId: pId, quantity: 1 }
                let arr = cartExist.items
                arr.push(obj)
                updateData['items'] = arr

                const productPrice = await productModel.findOne({ _id: pId, isDeleted: false }).select({ price: 1, _id: 0 })
                if (!productPrice) { return res.status(404).send({ status: false, message: `No product found with this ${pId}` }) }
                nPrice = productPrice.price
                updateData['totalPrice'] = cartExist.totalPrice + (nPrice * 1)
                updateData['totalItems'] = cartExist.items.length;

                const updatedCart = await cartModel.findOneAndUpdate({ _id: cId }, updateData, { new: true })
                return res.status(200).send({ status: true, message: "Updated Cart", data: updatedCart })
            }
        }

    }
    else {
        let newData = {}
        let arr = []
        newData.userId = uId;

        const object = { productId: pId, quantity: 1 }
        arr.push(object)
        newData.items = arr;

        const productPrice = await productModel.findOne({ _id: pId, isDeleted: false }).select({ price: 1, _id: 0 })
        if (!productPrice) { return res.status(404).send({ status: false, mesaage: `No product found with this ${pId}` }) }
        nPrice = productPrice.price;
        newData.totalPrice = nPrice;

        newData.totalItems = arr.length;

        const newCart = await cartModel.create(newData)

        return res.status(201).send({ status: true, message: "Cart details", data: newCart })


    }}
catch(err){
    return res.status(500).send({status:false, msg:err.mesaage})
}}




const getCart = async function (req, res) {

try{    let user = req.params.userId

    const userCheck = await userModel.findOne({ _id: user})

    if (!userCheck) { return res.status(404).send({ status: false, msg: "user not found" }) }

    const cart = await cartModel.findOne({ userId: user }).select({ _id: 1 })

    if (!cart) { return res.status(404).send({ status: false, msg: "Cart not found" }) }

    console.log(cart)

    const findCart = await cartModel.findOne({ _id: cart, isDeleted: false })

    return res.status(200).send({ status: true, msg: findCart })

}catch(err){
    return res.status(500).send({status:false, msg:err.mesaage})
}}

//...........................updatecart...........................
const updateCart=async (req,res)=>{
    try {
      let userId = req.params.userId
      let requestBody = req.body;
    //   let userIdFromToken = req.userId;
  
      //validation starts.

      if(!userId){return res.status(400).send({ status: false, message: "UserId does not exits" }) }
       
      let findUser = await userModel.findOne({ _id: userId })
      if (!objectId.isValid(findUser)) {
          return res.status(400).send({ status: false, message: "UserId does not exits" })
      }
  
 
  
      //Extract body
      const { cartId, productId, removeProduct } = requestBody
     
  
      //cart validation
      if (!isValidObjId.test(cartId)) {
          return res.status(400).send({ status: false, message: "Invalid cartId in body" })
      }
      let findCart = await cartModel.findById({ _id: cartId })
      if (!findCart) {
          return res.status(400).send({ status: false, message: "cartId does not exists" })
      }
  
      //product validation
      if (!isValidObjId.test(productId)) {
          return res.status(400).send({ status: false, message: "Invalid productId in body" })
      }
      let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
      if (!findProduct) {
          return res.status(400).send({ status: false, message: "productId does not exists" })
      }
  
      //finding if products exits in cart
      let isProductinCart = await cartModel.findOne({ items: { $elemMatch: { productId: productId } } })
      if (!isProductinCart) {
          return res.status(400).send({ status: false, message: `This ${productId} product does not exists in the cart` })
      }
  
      //removeProduct validation either 0 or 1.
      if (!(!isNaN(Number(removeProduct)))) {
          return res.status(400).send({ status: false, message: `removeProduct should be a valid number either 0 or 1` })
      }
  
      //removeProduct => 0 for product remove completely, 1 for decreasing its quantity.
      if (!((removeProduct === 0) || (removeProduct === 1))) {
          return res.status(400).send({ status: false, message: 'removeProduct should be 0 (product is to be removed) or 1(quantity has to be decremented by 1) ' })
      }
  
      let findQuantity = findCart.items.find(x => x.productId.toString() === productId)
          //console.log(findQuantity)
  
      if (removeProduct === 0) {
          let totalAmount = findCart.totalPrice - (findProduct.price * findQuantity.quantity) // substract the amount of product*quantity
  
          await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } } }, { new: true })
  
          let quantity = findCart.totalItems - 1
          let data = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: { totalPrice: totalAmount, totalItems: quantity } }, { new: true }) //update the cart with total items and totalprice
  
          return res.status(200).send({ status: true, message: `${productId} is been removed`, data: data })
      }
  
      // decrement quantity
      let totalAmount = findCart.totalPrice - findProduct.price
      let itemsArr = findCart.items
  
      for (i in itemsArr) {
          if (itemsArr[i].productId.toString() == productId) {
              itemsArr[i].quantity = itemsArr[i].quantity - 1
  
              if (itemsArr[i].quantity < 1) {
                  await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } } }, { new: true })
                  let quantity = findCart.totalItems - 1
  
                  let data = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: { totalPrice: totalAmount, totalItems: quantity } }, { new: true }) //update the cart with total items and totalprice
  
                  return res.status(200).send({ status: true, message: `No such quantity/product exist in cart`, data: data })
              }
          }
      }
      let data = await cartModel.findOneAndUpdate({ _id: cartId }, { items: itemsArr, totalPrice: totalAmount }, { new: true })
  
      return res.status(200).send({ status: true, message: `${productId} quantity is been reduced By 1`, data: data })
  
  } catch (err) {
  res.status(500).send({status:false, message:err.message})
  }
  }
//............................deletecart.....................................

const deleteCart = async function (req, res) {
    let user = req.params.userId

    const userCheck = await userModel.findOne({ _id: user })

    if (!userCheck) { return res.status(404).send({ status: false, msg: "user not found" }) }

    const cart = await cartModel.findOne({ userId: user }).select({ _id: 1 })

    if (!cart) { return res.status(404).send({ status: false, msg: "Cart not found" }) }

    const deletecartwithSize = await cartModel.findOneAndUpdate({ _id: cart }, { $set: { items:[],totalItems:0,totalPrice:0} }, { new: true })

    return res.status(200).send({ status: false, message: "the requested cart has been deleted successfully" })
}




module.exports.addtocart = addtocart
module.exports.getCart = getCart
module.exports.deleteCart = deleteCart
module.exports.updateCart =updateCart