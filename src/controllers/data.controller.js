const {v4:uuidv4} = require('uuid')
const{readFile,writeFile} =require('fs').promises
const {event} = require('../utils/eventhandlers')
const {validateData,validateId} = require('../middleware/validator')
const {createResponse,date,status} = require('../helpers/helper')
const path = require('path')

async function pagiantion(req,res){
    try{
        const filePath =path.join(__dirname,'..','data.json')
        const oData = await readFile(filePath,'utf-8')
        const oDataArr = JSON.parse(oData)

        const nLimit = parseInt(req.query.nLimit) || 2
        const nPage = parseInt(req.query.nPage) || 1
        const nStart = (nPage-1)*nLimit
        const nEnd = nPage*nLimit
        const oPageData = oDataArr.slice(nStart,nEnd)
        
        return createResponse(res, "OK", {oData:oPageData})
    }
    catch(err){
        console.log(err)
        return createResponse(res, "InternalServerError", {sMessage:err.message, bisError:true})
    }
}
async function getAlldata(req,res){

    try{
        const filePath =path.join(__dirname,'..','data.json')

        const oData = await readFile(filePath,'utf-8') 
        const oDataArr = JSON.parse(oData)
        
        const oNewdata = oDataArr.filter(i=>i.sStatus==="available" || i.sStatus==="Available")
        return createResponse(res, "OK", {sMessage:"Data Items Available", oData:oNewdata})
        
    }
    catch(err){
        console.log(err)
        return createResponse(res, "InternalServerError", {sMessage:err.message, bisError:true})
    }
}

async function getdataById(req,res){
    try{
        const {iId} = req.params
        console.log(iId)
        const filePath =path.join(__dirname,'..','data.json')
        const oData = await readFile(filePath,'utf-8')
        const oDataArr = JSON.parse(oData)
        const nId = oDataArr.findIndex(i=>i.id===iId)
        
        if(nId==-1){
            return createResponse(res, "NotFound", {sMessage:"Item not found", bisError:true})
        }
        return createResponse(res, "OK", {sMessage:"Data Item",oData:oDataArr[nId]})
        
    }
    catch(err){
        console.log(err)
        return createResponse(res, "InternalServerError", {sMessage: err.message, bisError:true})
    }
}

async function addData(req,res){

    const oBody = req.body
    try{
        const filePath =path.join(__dirname,'..','data.json')
        const oData = await readFile(filePath,'utf-8')
        const oDataArr = JSON.parse(oData)
        
        const oNewdata = oBody
        const getId=oDataArr.findIndex(i=>i.sName===oNewdata.sName)
        if(getId!==-1){
            return createResponse(res, "NotFound", {sMessage:"Item already exists", bisError:true})
        }
        oNewdata.iId = uuidv4()
        oNewdata.sCreatedAt=date()
        oNewdata.sUpdatedAt=date()
        oDataArr.push(oNewdata)
        await writeFile(filePath,JSON.stringify(oDataArr))
        event.emit('itemCreated',oNewdata)
        return createResponse(res, "Create" , {sMessage:"Data added successfully", oData:oNewdata})
    }
    catch(err){
        console.log(err);
        return createResponse(res, "InternalServerError", {sMessage:err.message, bisError:true})
    }
}

async function updateData(req,res){
    try{
        const {iId}= req.params
        const oBody = req.body
        const filePath =path.join(__dirname,'..','data.json')
        const oData = await readFile(filePath,'utf-8')
        const oDataArr = JSON.parse(oData)
        
        const nindex = oDataArr.findIndex((i)=>i.id==iId)
        if(nindex===-1){
            return createResponse(res, "NotFound", {sMessage:"Item not found", bisError:true})
        }
        validateData(res, oBody)
        const oNewdata = oBody
        const getId=oDataArr.findIndex(i=>i.sName===oNewdata.sName)
        //  if(getId!==-1){
        //     return createResponse(res, "NotFound", {sMessage:"Item already exists", bisError:true})
        // }
        console.log(oDataArr[nindex].sName)
        if(oNewdata.sName!== oDataArr[nindex].sName && getId){
            return createResponse(res, "NotFound", {sMessage:"Item Name already exists", bisError:true})
        }
       
        oDataArr[nindex] = {...oDataArr[nindex],...oNewdata}
        oNewdata.sCreatedAt=oDataArr[nindex].sCreatedAt
        oNewdata.sUpdatedAt=date()
        await writeFile(filePath,JSON.stringify(oDataArr))
        event.emit('itemUpdated',oDataArr[nindex])
        return createResponse(res, "OK", {sMessage:"Data Updated Successfully", oData:oDataArr[nindex]})
    }
    catch(err){
        console.log(err)
        return createResponse(res, "InternalServerError", {sMessage:err.message, bisError:true})
    }
}

async function deleteData(req,res){
    try{
        const {iId }= req.params
        const filePath =path.join(__dirname,'..','data.json')
        const oData = await readFile(filePath,'utf-8')
        const oDataArr = JSON.parse(oData)

        const nIndex = oDataArr.findIndex(i=>i.id===iId)

        if(nIndex===-1){
            return createResponse(res, "NotFound", {sMessage:"Item not found", bisError:true})
        }

        const oNewdata = oDataArr.filter(i=>i.id!==iId)
        await writeFile(filePath,JSON.stringify(oNewdata))
        event.emit('itemDeleted',oDataArr[nIndex])
        return createResponse(res, "OK", {sMessage:"Data Deleted Successfully"})
              
    }
    catch(err){
        console.log(err.message)
        return createResponse(res, "InternalServerError", {sMessage:err.me, bisError:true})
    }
}

module.exports={getAlldata,getdataById,addData,updateData,deleteData,pagiantion}