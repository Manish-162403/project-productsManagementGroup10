const isrequestBody = (requestBody) => {
    return Object.keys(requestBody).length > 0
}



const isValid = (value) => {
    if (typeof value === "undefined" || value === null)
        return false
    if (typeof value === "string" && value.trim().length === 0)
        return false
    else
        return true
}

const isValidobjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidavailableSizes = (availableSizes) => {
    return ["S", "XS", "M", "X", "L", "XXL", "XL"].indexOf(availableSizes) !== -1

}



module.exports.isrequestBody = isrequestBody
module.exports.isValid = isValid
module.exports.isValidobjectId = isValidobjectId
module.exports.isValidavailableSizes = isValidavailableSizes