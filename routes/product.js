const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/initialize-database', productController.initializeDatabase);

router.get('/statistics/:month', productController.statistics);
router.get('/bar-chart/:month', productController.barChart);
router.get('/pie-chart/:month', productController.pieChart);

router.get('/all-data/:month', productController.allData);

module.exports = router;
