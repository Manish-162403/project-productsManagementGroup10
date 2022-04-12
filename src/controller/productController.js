const productModel = require("../models/productModel")
const aws = require("aws-sdk")
const { LexModelBuildingService } = require("aws-sdk")
const validation = require("../validation/validation")

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {

        let s3 = new aws.S3({ apiVersion: "2006-03-01" })

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "group10/" + file.originalname,
            Body: file.buffer
        }
        console.log(uploadFile)
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }

            return resolve(data.Location)
        }
        )

    }
    )
}




const createProduct = async function (req, res) {
    try {
        let data = req.body
        // if(!validation.isrequestBody(data)){
        //     return res.status(400).send({status:false,msg:"provide some data to create product"})
        // }
        let files = req.files
        // const{title,description,price,currencyId,currencyFormat,isFreeShipping,productImage,style,availableSizes,installments}=data
        if (files && files.length > 0) {
            profileImagessweetselfie = await uploadFile(files[0])
        }

        const { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data

        data.productImage = profileImagessweetselfie//////////////////////////////////////////////look this
        if (!files) {
            return res.status(400).send({ status: false, mss: "select product image " })
        }
        if (!validation.isValid(title)) {
            return res.status(400).send({ status: false, msg: "please enter title " })
        }

        const findTitle = await productModel.findOne({ title: title })
        if (findTitle) {
            return res.status(400).send({ status: false, msg: `title is already used ${title}` })
        }

        if (!validation.isValid(description)) {
            return res.status(400).send({ status: false, msg: "please enter description " })
        }
        if (!validation.isValid(price)) {
            return res.status(400).send({ status: false, msg: "please enter prine " })
        }
        if (!validation.isValid(currencyId)) {
            return res.status(400).send({ status: false, msg: "please enter  currecnyId" })
        }
        if (!validation.isValid(currencyFormat)) {
            return res.status(400).send({ status: false, msg: "please enter currencyFormat" })
        }
        // if(!validation.isValid(isFreeShipping)){
        //     return res.status(400).send({status:false,msg:"please enter "})
        // }
        // if(!validation.isValid(style)){
        //     return res.status(400).send({status:false,msg:"please enter "})
        // }
        if (!validation.isValid(availableSizes)) {
            return res.status(400).send({ status: false, msg: "please enter  product size" })
        }
        // if(!validation.isValid(installments)){
        //     return res.status(400).send({status:false,msg:"please enter "})
        // }
        //data.productImage = profileImagessweetselfie
        const created = await productModel.create(data)

        return res.status(201).send({ status: false, data: created })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message })
    }
}
/******************************************************************* */
// const getProductbyQuery = async (req, res) => {
//     try {
//         const input = req.query

//         const book = await bookModel.find(input, { isDeleted: false }).select({ title:1, description:1, price:1, currencyId:1, currencyFormat:1 }).sort({ title: 1 })

//         if (book.length == 0) return res.status(404).send({ status: false, msg: "no such  data found" })

//         return res.status(200).send({ status: true, msg: "Book lists", data: book })
//     }
//     catch (err) {
//         return res.status(500).send({ status: false, msg: err.message })
//     }

// }


/******************************************************************** */




let getProductById = async function (req, res) {

    try {
        let id = req.params.productID


        if (!id) { return res.status(400).send({ status: false, message: "please input ID" }) }
        
        if (!validation.isValidobjectId) {
            return res.status(404).send({ status: false, msg: "this ID is not valid" })
        }
        let getProduct = await productModel.findOne({ _id: id, isDeleted: false })

        if (!getProduct) { return res.status(404).send({ status: false, message: "product not found" }) }

        if (getProduct.isDeleted == true) { return res.status(400).send({ status: false, msg: "product has already been deleted" }) }


        return res.status(200).send({ Status: true, message: getProduct })


    } catch (error) {
        return res.status(500).send({ status: false, messge: error.message })
    }
}






let deleteproductById = async function (req, res) {

    try {
        let id = req.params.productID


        // return res.status(200).send({ Status: "Requested product has been deleted." })
        let productToBeDeleted = await productModel.findById(id)

        if (!productToBeDeleted) { return res.status(404).send({ status: false, message: "product not found" }) }

        if (productToBeDeleted.isDeleted == true) { return res.status(400).send({ status: false, msg: "product has already been deleted" }) }


        let deletedproduct = await productModel.findOneAndUpdate({ _id: id },
            { $set: { isDeleted: true, deletedAt: Date.now() } })


    } catch (err) {
        return res.status(500).send({ status: false, messge: err.message })
    }
}



module.exports.getProductbyQuery=getProductbyQuery


module.exports.createProduct = createProduct
module.exports.deleteproductById = deleteproductById
module.exports.getProductById = getProductById