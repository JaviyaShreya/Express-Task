const { check } = require('express-validator');
const { getAlldata, getdataById, addData, updateData, deleteData,pagiantion } = require('../controllers/data.controller');
const express = require('express');
const { reqValidator, StatusValidate } = require('../middleware/validator');
const router = express.Router();

router.get('/data',getAlldata)

router.get('/data/:iId',[check("iId").isUUID().withMessage("Enter Valid ID"),reqValidator],getdataById)

router.post('/data',[check("sName").isString().notEmpty().withMessage("Name can't be empty"),
    check("nQuantity").isNumeric().isInt({gt:0}).notEmpty().withMessage("Quantity can't be empty"),
    check("nPrice").isNumeric().isInt({gt:0}).notEmpty().withMessage("Price can't be empty"),
    check("sStatus").isString().notEmpty().withMessage("Status can't be empty"),
    StatusValidate,
    reqValidator,
],addData)  

router.put('/data/:iId',[check("sName").isString().notEmpty().withMessage("Name can't be empty"),
    check("iId").isUUID().withMessage("Enter Valid ID"),
    check("nQuantity").optional().isInt({gt:0}).isNumeric().notEmpty().withMessage("Quantity must be number and can't be empty"),
    check("nPrice").optional().isInt({gt:0}).isNumeric().notEmpty().withMessage("Price must be number and can't be empty"),
    check("sStatus").optional().isString().notEmpty().withMessage("Status can't be empty"),
    StatusValidate,
    reqValidator
],updateData)

router.delete('/data/:iId',[check("iId").isUUID().withMessage("Enter Valid ID"),reqValidator],deleteData)

router.get('/pagiantion',pagiantion)

module.exports = router