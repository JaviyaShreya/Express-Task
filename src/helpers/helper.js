const status = {
    OK: 200,
    Create: 201,
    Deleted: 204,
    BadRequest: 400,
    Unauthorized: 401,
    NotFound: 404,
    Forbidden: 403,
    NotAcceptable: 406,
    ExpectationFailed: 417,
    Locked: 423,
    InternalServerError: 500,
    UnprocessableEntity: 422,
    ResourceExist: 409,
    TooManyRequest: 429
}
function createResponse(res, responseType,sMessage="", bisError=false, oData){
    
    if(bisError){
        // const nstatuscode = status[responseType] || status.InternalServerError
       res.status(nstatuscode).json({message: sMessage})
        return
    }
    else if(oData){
        // const nstatuscode = status[responseType] || status.InternalServerError
       res.status(nstatuscode).json({sMessage, oData})
       return
    }
    else if(sMessage){
        const nstatuscode = status[responseType] || status.InternalServerError
        res.status(nstatuscode).json({message: sMessage})
        return
    }
} 

function date(){
    let nday=new Date().getDate()
    let nmonth=new Date().getMonth()+1
    let nyear=new Date().getFullYear()
    return `${nday}/${nmonth}/${nyear}`
}


module.exports = {createResponse,date, status}