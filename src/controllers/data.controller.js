const {v4:uuidv4} = require('uuid')
const{readFile,writeFile} =require('fs').promises
const {event} = require('../utils/eventhandlers')
const {validateData,validateId} = require('../middleware/validator')
const {createResponse,date} = require('../helpers/helper')
const path = require('path')

async function pagiantion(req,res){
    try{
        const filePath =path.join(__dirname,'..','data.json')
        const odata = await readFile(filePath,'utf-8')
        const odataArr = JSON.parse(odata)

        const nlimit = parseInt(req.query.nlimit) || 2
        const npage = parseInt(req.query.npage) || 1
        const nstart = (npage-1)*nlimit
        const nend = npage*nlimit
        const opageData = odataArr.slice(nstart,nend)
        
        return createResponse({res, nstatuscode:200, oData:opageData})
    }
    catch(err){
        console.log(err)
        if(err){
            if(err.code==="ENOENT"){
                return createResponse({res, nstatuscode:404, sMessage:"Data not found", bisError:true})
            }
            else{
                return createResponse({res, nstatuscode:500, sMessage:err.message, bisError:true})
            }
        }
    }
}
async function getAlldata(req,res){
    try{
        const filePath =path.join(__dirname,'..','data.json')

        const odata = await readFile(filePath,'utf-8') 
        const odataArr = JSON.parse(odata)
        const onewdata = odataArr.filter(i=>i.sstatus==='available')
        return createResponse({res, nstatuscode:200, sMessage:"Data Items Available", oData:onewdata})
        
    }
    catch(err){
        console.log(err)
        if(err){
            if(err.code==="ENOENT"){
                return createResponse({res, nstatuscode:404, sMessage:"Data not found", bisError:true})
            }
            else{
                return createResponse({res, nstatuscode:500, sMessage:err.message, bisError:true})
            }
        }
    }
}

async function getdataById(req,res){
    try{
        const iId = req.params.id
        validateId(iId)
        const filePath =path.join(__dirname,'..','data.json')
        const odata = await readFile(filePath,'utf-8')
        const odataArr = JSON.parse(odata)
        const nId = odataArr.findIndex(i=>i.id===iId)
        if(nId==-1){
            return createResponse({res, nstatuscode:404, sMessage:"Item not found", bisError:true})
        }
        //const oItem = odataArr.find(i=>i.id===iId)
        return createResponse({res, nstatuscode:200, sMessage:"Data Item",oData:odataArr[nId]})
        
    }
    catch(err){
        console.log(err)
        if(err){
            if(err.code==="ENOENT"){
                return createResponse({res, nstatuscode:404, sMessage:"Data not found", bisError:true})
            }
            else{
                return createResponse({res, nstatuscode:500, sMessage: err.message, bisError:true})
            }
        }
    }
}

async function addData(req,res){

    const obody = req.body
    try{
        validateData(res,obody)
        const filePath =path.join(__dirname,'..','data.json')
        const odata = await readFile(filePath,'utf-8')
        const odataArr = JSON.parse(odata)
        
        const onewdata = obody
        const getId=odataArr.findIndex(i=>i.sname===onewdata.sname)
        if(getId!==-1){
            return createResponse({res, nstatuscode:400, sMessage:"Item already exists", bisError:true})
        }
        onewdata.id = uuidv4()
        onewdata.screatedAt=date()
        onewdata.supdatedAt=date()
        odataArr.push(onewdata)
        await writeFile(filePath,JSON.stringify(odataArr))
        event.emit('itemCreated',onewdata)
        return createResponse({res, nstatuscode:201, sMessage:"Data added successfully", oData:onewdata})
    }
    catch(err){
        console.log(err)
        if(err.code==="ENOENT"){
            return createResponse({res, nstatuscode:404, sMessage:"Data not found", bisError:true})
        }
        else{
            return createResponse({res, nstatuscode:500, sMessage:err.message, bisError:true})
        }
    }
}

async function updateData(req,res){
    try{
        const iId = req.params.id
        validateId(iId)
        const obody = req.body
        const filePath =path.join(__dirname,'..','data.json')
        const odata = await readFile(filePath,'utf-8')
        const odataArr = JSON.parse(odata)
        
        const nindex = odataArr.findIndex((i)=>i.id==iId)
        if(nindex===-1){
            return createResponse({res, nstatuscode:404, sMessage:"Item not found", bisError:true})
        }
        validateData(res, obody)
        const onewdata = obody
        const getId=odataArr.findIndex(i=>i.sname===onewdata.sname)
        if(getId!==-1){
            return createResponse({res, nstatuscode:400, sMessage:"Item already exists", bisError:true})
        }
        odataArr[nindex] = {...odataArr[nindex],...onewdata}
        onewdata.screatedAt=odataArr[nindex].screatedAt
        onewdata.supdatedAt=date()
        await writeFile(filePath,JSON.stringify(odataArr))
        event.emit('itemUpdated',odataArr[nindex])
        return createResponse({res, nstatuscode:200, sMessage:"Data Updated Successfully", oData:odataArr[nindex]})
    }
    catch(err){
        if(err){
            console.log(err)
            if(err.code==="ENOENT"){
                return createResponse({res, nstatuscode:404, sMessage:"Data not found", bisError:true})
            }
            else{
                return createResponse({res, nstatuscode:500, sMessage:err.message, bisError:true})
            }
        }
    }
}

async function deleteData(req,res){
    try{
        const iId = req.params.id
        validateId(iId)
        const filePath =path.join(__dirname,'..','data.json')
        const odata = await readFile(filePath,'utf-8')
        const odataArr = JSON.parse(odata)

        const nindex = odataArr.findIndex(i=>i.id===iId)

        if(nindex===-1){
            return createResponse({res, nstatuscode:404, sMessage:"Item not found", bisError:true})
        }

        const onewdata = odataArr.filter(i=>i.id!==iId)
        await writeFile(filePath,JSON.stringify(onewdata))
        event.emit('itemDeleted',odataArr[nindex])
        return createResponse({res, nstatuscode:200, sMessage:"Data Deleted Successfully"})
              
    }
    catch(err){
        console.log(err.message)
        if(err){
            if(err.code==="ENOENT"){
                return createResponse({res, nstatuscode:404, sMessage:"Data not found", bisError:true})
            }
            else{
                return createResponse({res, nstatuscode:500, sMessage:err.me, bisError:true})
            }
        }
    }
}

module.exports={getAlldata,getdataById,addData,updateData,deleteData,pagiantion}