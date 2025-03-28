const { v4: uuidValidate } = require('uuid');
const { createResponse } = require('../helpers/helper');


function validateData(res,onewdata){
    if(!onewdata.sname || !onewdata.nquantity || !onewdata.nprice || !onewdata.sstatus){
        return createResponse({res, nstatuscode:400, sMessage:"Enter valid oData"})
    }
    else if(typeof onewdata.sname !== 'string' || typeof onewdata.nquantity !== 'number' || typeof onewdata.nprice !== 'number' || typeof onewdata.sstatus !== 'string'){
        return createResponse({res, nstatuscode:400, sMessage:"Enter valid oData"})
    }
    else if(onewdata.nquantity < 0 || onewdata.nprice < 0){
        return createResponse({res, nstatuscode:400, sMessage:"Enter valid oData"})
    }
    else if(onewdata.sname === "" || onewdata.nquantity === "" || onewdata.nprice === "" || onewdata.sstatus === ""){
        return createResponse({res, nstatuscode:400, sMessage:"Enter valid oData"})
    }

        
}
function validateId(res, id){
    if(!uuidValidate(id)){
        return createResponse({res, nstatuscode:400, sMessage:"Invalid ID"})
    }
}
module.exports = {validateData, validateId}