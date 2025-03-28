const { getAlldata, getdataById, addData, updateData, deleteData,pagiantion } = require('../controllers/data.controller');
const express = require('express');
const router = express.Router();

router.get('/data',getAlldata)

router.get('/data/:id',getdataById)

router.post('/data',addData)  

router.put('/data/:id',updateData)

router.delete('/data/:id',deleteData)

router.get('/pagiantion',pagiantion)

module.exports = router