const express = require('express')
const router = express.Router();

const productController = require('../controllers/productController')

router.get('/initialize-database',productController.initializeDatabase)

module.exports = router;