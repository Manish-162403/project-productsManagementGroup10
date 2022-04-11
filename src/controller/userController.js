const userModel = require("../models/userModel")
const aws = require("aws-sdk");
const validation = require("../validation/validation")


const jwt = require("jsonwebtoken")




aws.config.update(
    {
        accessKeyId: "AKIAY3L35MCRVFM24Q7U",
        secretAccessKey: "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",
        region: "ap-south-1"
    }
)


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


const pic = async function (req, res) {
    try {
        let files = req.files
        if (files && files.length > 0) {
            let profileImage = await uploadFile(files[0])
            res.status(201).send({ msg: "file uploaded succesfully", data: profileImage })
        }
        else {
            res.status(400).send({ msg: "No file found" })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }
}




const createUSer = async function (req, res) {
    try {
        let data = req.body
        let files = req.files
        let address = JSON.parse(req.body.address)

        const { fname, lname, email, phone, password } = data
        let profileImagessweetselfie
        if (files && files.length > 0) {
            profileImagessweetselfie = await uploadFile(files[0])
        }
        console.log(profileImagessweetselfie)
        // const output = await userModel.create(data,address)

        const finalData = { fname, lname, email, phone, password, address }
        console.log(finalData)
        data.profileImage = profileImagessweetselfie
        finalData.profileImage = profileImagessweetselfie
        data.address = address
        //console.log(profileImage)
        const output = await userModel.create(data)
        return res.status(201).send({ msg: "Data uploaded succesfully", data: finalData })

    }//address[shipping][street]

    catch (err) {
        console.log(err)
        return res.status(500).send({ msg: err.message })
    }
}

const getProfie = async function (req, res) {
    try {
        const data = req.params.userId



        const getProfiileData = await userModel.findOne({ _id: data })

        console.log(getProfiileData)

        return res.send(getProfiileData)
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ msg: false, msg: err.message })
    }
}




const logIn = async (req, res) => {
    try {
        let body = req.body
        if (!validation.isrequestBody(body))
            return res.status(400).send({ status: false, msg: "invalid request parameter, please provide login details" })

        const { email, password } = body

        if (!validation.isValid(email))
            return res.status(400).send({ status: false, msg: "please enter email" })

        if (!validation.isValid(password))
            return res.status(400).send({ status: false, msg: "please enter password" })

        var input = await userModel.findOne({ email, password })

        if (!input)
            return res.status(404).send({ status: false, msg: "user not found please enter valid credentials" })

        var token = jwt.sign({

            userId: input._id.toString(),

            group: "10",
            iat: Math.floor(Date.now() / 1000),         //doubt clear about this after some time   //payload
            exp: Math.floor(Date.now() / 1000) + 1 * 60 * 60    //1 hourds:minute:second

        }, "group10")//secret key
        //const userId: input._id.toString(),
        res.setHeader("x-api-key", token) // look ion the postman body header


        return res.status(200).send({ status: true, msg: "user loing successfully", data: token })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}





module.exports.createUSer = createUSer;
module.exports.pic = pic
module.exports.logIn = logIn
module.exports.getProfie = getProfie