const express = require('express');
const router = express.Router();



const mid=require("../middleware/auth")

const userControl= require("../controller/userController")
const productControl =require("../controller/productController")


//................  user api  ..........................

router.post("/register", userControl.createUSer)

router.post("/login",userControl.logIn)

router.get("/user/:userId/profile",mid.auhtentication,userControl.getProfie)

router.put("/user/:userId/profile",mid.auhtentication, userControl.updateUser)

//.....................product......................

router.get("/products", productControl.getProduct)
router.post("/products", productControl.createProduct)
router.delete("/products/:productId", productControl.deleteproductById)
router.put("/products/:productId", productControl.updateById)
router.get("/products/:productId", productControl.getProductById)

//router.post("//products", url2.)



module.exports= router;