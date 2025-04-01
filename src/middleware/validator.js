const { createResponse } = require('../helpers/helper');
const { validationResult , check} = require('express-validator');


function reqValidator(req,res,next){
    const err = validationResult(req);
    if(!err.isEmpty()){
        return createResponse(res, "BadRequest", err)
    }
    next()
}
function filpathExists(filePath){
    if(!filePath){
        return createResponse(res, "BadRequest", {sMessage:"File path is not valid"})
    }
}

const StatusValidate = [
    check("sstatus").isString().isIn(["available","Available","Unavailbale","unavailable"]).notEmpty().withMessage("Status can't be empty"),

]
module.exports = {reqValidator, filpathExists,StatusValidate}