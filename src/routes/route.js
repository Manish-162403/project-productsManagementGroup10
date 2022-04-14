const express = require('express');
const router = express.Router();



const mid=require("../middleware/auth")

const userControl= require("../controller/userController")
const productControl =require("../controller/productController")
const cart= require("../controller/cartController")

//................  user api  ..........................

router.post("/register", userControl.createUSer)

router.post("/login",userControl.logIn)

router.get("/user/:userId/profile",mid.auhtentication,userControl.getProfie)

router.put("/user/:userId/profile",mid.auhtentication, userControl.updateUser)

//.....................product......................
router.post("/products", productControl.createProduct)

router.get("/products", productControl.getProduct)

router.get("/products/:productId", productControl.getProductById)

router.put("/products/:productId", productControl.updateById)

router.delete("/products/:productId", productControl.deleteproductById)


//....................................cart....................................

router.post("/users/:userId/cart", cart.addtocart)



module.exports= router;