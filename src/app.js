const dotenv = require('dotenv');
dotenv.config();
const routes = require('./routes/data.routes');

const express = require('express');
const app = express();
// const bodyParser = require('body-parser');

// app.use(bodyParser.json());

app.use('/healthcheck', (req,res)=>{
    res.status(200).json({message: "Server is up and running"})
})

app.use(express.json())
app.use('/api', routes)

app.use('/public', express.static('public'))

app.use(function (req, res) {
    res.status(401).json({ error: "Page not Found" });
})

app.listen(process.env.PORT,(req,res)=>{
    console.log(`Server is running on port http://localhost:${process.env.PORT}`)
})

