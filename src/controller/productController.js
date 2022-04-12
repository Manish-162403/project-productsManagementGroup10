const productModel=require("../models/productModel")
const aws=require("aws-sdk")

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




const createProduct=async function(req,res){
    try{
        let data=req.body
        let files = req.files
        // const{title,description,price,currencyId,currencyFormat,isFreeShipping,productImage,style,availableSizes,installments}=data
        if (files && files.length > 0) {
            profileImagessweetselfie = await uploadFile(files[0])
        }
    
        const{title,description,price,currencyId,currencyFormat,isFreeShipping,style,availableSizes,installments}=data

        data.productImage=profileImagessweetselfie 

        



        const created=await productModel.create(data)
        
        return res.status(201).send({status:false,data:created})
    }
    catch(err){
        console.log(err)
        return res.status(500).send({status:false,msg:err.message})
    }
}

module.exports.createProduct=createProduct