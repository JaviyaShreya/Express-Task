
function createResponse({res, nstatuscode, sMessage="", bisError=false, oData}){
    if(bisError){
       res.status(nstatuscode).json({message: sMessage})
        return
    }
    else if(oData){
       res.status(nstatuscode).json({sMessage, oData,})
       return
    }
    else if(sMessage){
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


module.exports = {createResponse,date}