const fetch = require('node-fetch');

const Product = require('../models/product');

exports.initializeDatabase = async (req, res) => {
  try {
    const response = await fetch(
      'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
    );

    const data = await response.json();

    data.forEach((element) => {
      const product = new Product({
        id: element.id,
        title: element.title,
        price: element.price,
        description: element.description,
        category: element.category,
        image: element.image,
        sold: element.sold,
        dateOfSale: element.dateOfSale,
      });

      product.save()
    });

    res.status(200).json({
      success: true,
      message: 'database initialized'
    });
  } catch (error) {
    console.log(error);
  }
};
