const {port}= require('./config/config');
const { errorHandler } = require('./src/middleware/errorHandler');
const routes = require('./src/routes/data.routes');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use('/healthcheck', (req,res)=>{
    res.status(200).json({message: "Server is up and running"})
})

//app.use(express.json())
app.use('/api', routes)

app.use('/public', express.static('public'))

app.use(errorHandler)

app.listen(port,(req,res)=>{
    console.log(`Server is running on port http://localhost:${port}`)
})

