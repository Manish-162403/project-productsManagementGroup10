const express = require('express');
const router = express.Router();



const middleware=require("../middleware/auth")

const url1= require("../controller/userController")

const productController=require("../controller/productController")

router.post("/write-file-aws", url1.pic)

router.post("/register", url1.createUSer)

router.post("/login",url1.logIn)


router.get("/user/:userId/profile",middleware.auhtentication,url1.getProfie)

router.put("/user/:userId/profile",middleware.auhtentication, url1.updateUser)

router.post("/products",productController.createProduct)

//router.get("/test",productController.getProductbyQuery)

//router.get("/products",productController.getProductById)

///router.delete("/products/:productId",url1.deleteproductById)

//router.put("")


module.exports= router;