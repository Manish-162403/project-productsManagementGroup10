const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const objectId = require('mongoose').Types.ObjectId

const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false
    if (typeof value == 'string' && value.trim().length === 0) return false
    return true
}


const addtocart = async function (req, res) {
    try {
        let userId = req.params.userId
        let { cartId, productId } = req.body

        if(!objectId.isValid(userId)){return res.status(400).send({status: flase, message: "user does not exist"})}

        if (Object.keys(req.body) == 0) {
            return res.status(400).send({ status: false, msg: "please enter some data" })
        }
        if (!userId) {
            return res.status(400).send({ status: false, msg: "userId is required" })
        }
        if (!objectId.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "userId is invalid" })
        }
        let userData = await userModel.findOne({ _id: userId })
        if (!userData) { return res.status(404).send({ status: false, msg: "user data not found " }) }
        if (!productId) {
            return res.status(400).send({ status: false, msg: "productId  required" })
        }
        if (!objectId.isValid(productId)) {
            return res.status(400).send({ status: false, msg: "productId is invalid" })
        }
        if (!cartId ) {
            let cartDataCheck = await cartModel.findOne({ userId: userId })
            if (cartDataCheck) { return res.status(400).send({ status: false, msg: "cartData already exist for this user please add to cart" }) }
        }
        let cartData = await cartModel.findOne({ _id: cartId })

        if (cartData) {

            if (cartData.userId != userId) {
                return res.status(403).send({ status: false, msg: "this cart userId and params user not same ,please check cartId" })
            }
            let updateData = {}
            console.log(cartData.items.length)

            for (let i = 0; i < cartData.items.length; i++) {
                if (cartData.items[i].productId == productId) {
                    cartData.items[i].quantity = cartData.items[i].quantity + 1;

                    updateData['items'] = cartData.items
                    const productPrice = await productModel.findOne({ _id: productId, isDeleted: false }).select({ price: 1, _id: 0 })
                    if (!productPrice) {
                        return res.status(404).send({ status: false, msg: "product not found" })
                    }
                    price = productPrice.price
                    updateData['totalPrice'] = cartData.totalPrice + price
                    updateData['totalItems'] = cartData.items.length

                    const cartUpdate = await cartModel.findOneAndUpdate({ _id: cartId }, updateData, { new: true })
                    return res.status(201).send({ status: true, message: "Success", data: cartUpdate })

                }
                if (cartData.items[i].productId != productId && i == cartData.items.length - 1) {
                    let obj = { productId: productId, quantity:1 }
                    let arr = cartData.items
                    arr.push(obj)

                    updateData['items'] = arr

                    const productPrice = await productModel.findOne({ _id: productId, isDeleted: false }).select({ price: 1, _id: 0 })
                    if (!productPrice) { return res.status(404).send({ status: false, message: ` product not found with this ${productId}` }) }
                    Price = productPrice.price
                    updateData['totalPrice'] = cartData.totalPrice + Price
                    updateData['totalItems'] = cartData.items.length;

                    const updatedCart = await cartModel.findOneAndUpdate({ _id: cartId }, updateData, { new: true })
                    return res.status(201).send({ status: true, message: "Success", data: updatedCart })
                }

            }

        }
        else {
            let arr = []
            let newData = {}
            newData.userId = userId;
            let object = { productId: productId, quantity:1 }
            arr.push(object)
            newData['items'] = arr
            const productPrice = await productModel.findOne({ _id: productId, isDeleted: false }).select({ price: 1, _id: 0 })
            if (!productPrice) { return res.status(404).send({ status: false, msg: `No product found with this ${productId}` }) }
            Price = productPrice.price;
            newData.totalPrice = Price;

            newData['totalItems'] = arr.length;

            const newCart = await cartModel.create(newData)

            return res.status(201).send({ status: true, message: "Success", data: newCart })

        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}



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
      if (!objectId.isValid(cartId)) {
          return res.status(400).send({ status: false, message: "Invalid cartId in body" })
      }
      let findCart = await cartModel.findById({ _id: cartId })
      if (!findCart) {
          return res.status(400).send({ status: false, message: "cartId does not exists" })
      }
  
      //product validation
      if (!(objectId.isValid(productId))) {
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