const express = require('express');
const dataroutes = require('./data.routes');
 const router = express.Router();

 router.use('/', dataroutes);

 module.exports = router;