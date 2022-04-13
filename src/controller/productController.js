const aws = require("aws-sdk");
const productModel = require("../models/productModel");




const isValid = function (value) {
    if (typeof value == undefined || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim.length === 0) return false
    return true

}
// const isValidRequestBody = function (requestBody) {
//     return Object.keys(requestBody).length > 0
// }



/***********   S3 image Upload PArt   ******************** */



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
        let files = req.files
      
        if (files && files.length > 0) {
            profileImagessweetselfie = await uploadFile(files[0])
        }

        const { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data

        data.productImage = profileImagessweetselfie

        const created = await productModel.create(data)

        return res.status(201).send({ status: true, data: created })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message })
    }
}






/*********     Qery Filter           *********************** */




const getProduct = async function (req, res) {

    try {

        let {size,name,greaterThenPrice,lessThenPrice,priceSort} = req.query
      
        let filter = {isDeleted: false }
        console.log(filter)
      console.log(name)

       // let check = await productModel.find(data.title)
  

        if (isValid(size)) { filter['availableSizes'] = size }
        let arr =[]
       
         if (isValid(name)) {

             let newOne = await productModel.find({isDeleted:false}).select({title:1, _id:0})
             console.log(newOne) 
            // let a= newOne.title
             for (let i = 0; i < newOne.length; i++) {
                 let element = newOne[i].title
                 let checkVar = element.includes(name)
             if(checkVar){
                  arr.push(newOne[i].title)

                }
                console.log(arr)
              }
                filter["title"] = arr
            }
    

     if(greaterThenPrice != null && lessThenPrice == null) {

        filter["price"] = {$gt:greaterThenPrice}
     }      

     if(greaterThenPrice == null && lessThenPrice != null) {

        filter["price"] = {$lt:lessThenPrice}
     }  
     
     if(greaterThenPrice != null && lessThenPrice != null) {

        filter["price"] = {$gt:greaterThenPrice, $lt:lessThenPrice}
     }     

     if(priceSort==1){

        let getData = await productModel.find(filter).sort({price:1})

        if(getData.length==0){return res.status(404).send({status:false, msg:"data not found"})}
     
        return res.status(200).send({ status: true, Data:getData} )}

        if(priceSort==-1){

            let getData = await productModel.find(filter).sort({price:-1})
            if(getData.length==0){return res.status(404).send({status:false, msg:"data not found"})}
         
            return res.status(200).send({ status: true, Data:getData} )}

            let getData = await productModel.find(filter)

            if(getData.length==0){return res.status(404).send({status:false, msg:"data not found"})}

            return res.status(200).send({ status: true, Data:getData} )
   }

    catch (err) {
        res.status(500).send({ msg: err })
    }
}



/************* GET PRODUCT BY ID*********************** */

const getProductById = async function (req, res) {
    try {

        let id = req.params.productId

        let findId = await productModel.findOne({ _id: id })
        if (!findId) {
            return res.status(404).send({ status: false, msg: "Id not found" })
        }
        return res.status(200).send({ status: true, msg: findId })


    } catch (err) {
        return res.Status(500).send({ status: false, message: err.message })
    }

}

/***********        UPdateById      *************************** */

let updateById = async function (req, res) {

    try {
        let id = req.params.productId

        console.log(id)
        let data = req.body
        let files = req.files
      
       
        let productToBeUpdated = {}


       // if (Object.keys(id).length == 0) { return res.status(400).send({ status: false, message: "please input the Id in proper manner" }) }

       // if (!Object.keys(data).length>0) { return res.status(400).send({ status: false, message: "please input the data in proper manner" }) }

        let updateProduct = await productModel.findOne({ _id: id, isDeleted: false })

        if (!updateProduct) { return res.status(404).send({ status: false, message: "product not found" }) }

        if (updateProduct.isDeleted == true) { return res.status(400).send({ status: false, msg: "product has already been deleted" }) }


      
        if (isValid(data.title)) { productToBeUpdated['title'] = data.title }
        if (isValid(data.price)) { productToBeUpdated['price'] = data.price }
        if (isValid(data.currencyId)) { productToBeUpdated['currencyId'] = data.currencyId }
        if (isValid(data.style)) { productToBeUpdated['style'] = data.style }
        if (isValid(data.description)) { productToBeUpdated['discription'] = data.discription }
        if (isValid(data.currencyFormat)) { productToBeUpdated['currencyFormat'] = data.currencyFormat }
        if (isValid(data.isFreeShipping)) { productToBeUpdated['isFreeShipping'] = data.isFreeShipping }
        if (isValid(data.installments)) { productToBeUpdated['installments'] = data.installments }
        if (isValid(data.availableSizes)) { productToBeUpdated['availableSizes'] = data.availableSizes }


        if (files.length > 0) {
            profileImagessweetselfie = await uploadFile(files[0])

            productToBeUpdated.productImage=profileImagessweetselfie}
        //if(data.productImage){productToBeUpdated['productImage'] = profileImagessweetselfie}
       //if (isValid(data.productImage)) { productToBeUpdated['productImage'] = profileImagessweetselfie }}



        let updatedItem = await productModel.findOneAndUpdate({ _id: id, isDeleted:false }, productToBeUpdated, { new: true })

        return res.status(200).send({ Status: "success", data: updatedItem })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

/*************  DELETBY ID    ****************** */



let deleteproductById = async function (req, res) {
    try {
        let id = req.params.productId

        if (id) {

            let blogToBeDeleted = await productModel.findById(id)

            if (!blogToBeDeleted) { return res.status(404).send({ status: false, message: "product not found" }) }

            if (blogToBeDeleted.isDeleted == true) { return res.status(400).send({ status: false, msg: "product has already been deleted" }) }


            let deletedproduct = await productModel.findOneAndUpdate({ _id: id },
                { $set: { isDeleted: true, deletedAt: Date.now() } })

            return res.status(200).send({ Status: "Requested product has been deleted." })


        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.createProduct = createProduct
module.exports.getProduct = getProduct
module.exports.getProductById = getProductById
module.exports.updateById = updateById
module.exports.deleteproductById = deleteproductById