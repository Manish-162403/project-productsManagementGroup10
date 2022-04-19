const express = require('express');
const router = express.Router();



const mid=require("../middleware/auth")

const userControl= require("../controller/userController")
const productControl =require("../controller/productController")
const cart= require("../controller/cartController")
const order = require("../controller/orderController")

//................  user api  ..........................

router.post("/register", userControl.createUSer)

router.post("/login",userControl.logIn)

router.get("/user/:userId/profile",mid.authentication,userControl.getProfie)

router.put("/user/:userId/profile",mid.authentication,mid.authorization, userControl.updateUser)

//.....................product......................
router.post("/products", productControl.createProduct)

router.get("/products", productControl.getProduct)

router.get("/products/:productId", productControl.getProductById)

router.put("/products/:productId", productControl.updateById)

router.delete("/products/:productId", productControl.deleteproductById)


//....................................cart....................................

router.post("/users/:userId/cart",mid.authentication,mid.authorization, cart.addtocart)

router.get("/users/:userId/cart",mid.authentication,mid.authorization, cart.getCart)

router.put("/users/:userId/cart",mid.authentication,mid.authorization,cart.updateCart)

router.delete("/users/:userId/cart",mid.authentication,mid.authorization, cart.deleteCart)


//.......................................order.......................................

router.post("/users/:userId/orders",mid.authentication,mid.authorization,order.orderPlaced)

router.put("/users/:userId/orders",mid.authentication,mid.authorization,order.updateOrder)

module.exports= router;