const fetch = require('node-fetch');

const Product = require('../models/product');

exports.initializeDatabase = async (req, res) => {
  try {
    const response = await fetch(
      'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
    );

    const data = await response.json();

    await Product.deleteMany({});

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

      product.save();
    });

    return res.status(200).json({
      success: true,
      message: 'database initialized',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

exports.statistics = async (req, res) => {
  try {
    const userSentMonth = parseInt(req.params.month);

    const allProducts = await Product.aggregate([
      { $addFields: { month: { $month: '$dateOfSale' } } },
      { $match: { month: userSentMonth } },
    ]);

    let soldItems, unsoldItems, saleOfMonth;
    soldItems = unsoldItems = saleOfMonth = 0;

    allProducts.forEach((product) => {
      if (product.sold) {
        soldItems++;
      } else {
        unsoldItems++;
      }
      saleOfMonth += product.price;
    });

    return res.status(200).json({
      success: true,
      soldItems,
      unsoldItems,
      saleOfMonth,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

exports.barChart = async (req, res) => {
  try {
    const userSentMonth = parseInt(req.params.month);

    const allProducts = await Product.aggregate([
      { $addFields: { month: { $month: '$dateOfSale' } } },
      { $match: { month: userSentMonth } },
    ]);

    let zero, one, two, three, four, five, six, seven, eight, nine;

    zero = one = two = three = four = five = six = seven = eight = nine = 0;

    allProducts.forEach((product) => {
      let price = product.price;
      if (price <= 100) {
        zero++;
      } else if (price >= 101 && price <= 200) {
        one++;
      } else if (price >= 201 && price <= 300) {
        two++;
      } else if (price >= 301 && price <= 400) {
        three++;
      } else if (price >= 401 && price <= 500) {
        four++;
      } else if (price >= 501 && price <= 600) {
        five++;
      } else if (price >= 601 && price <= 700) {
        six++;
      } else if (price >= 701 && price <= 800) {
        seven++;
      } else if (price >= 801 && price <= 900) {
        eight++;
      } else {
        nine++;
      }
    });

    const barChartData = {
      '0-100': zero,
      '101-200': one,
      '201-300': two,
      '301-400': three,
      '401-500': four,
      '501-600': five,
      '601-700': six,
      '701-800': seven,
      '801-900': eight,
      '901-above': nine,
    };

    return res.status(200).json({
      success: true,
      barChartData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

exports.pieChart = async (req, res) => {
  try {
    const userSentMonth = parseInt(req.params.month);
    const allProducts = await Product.aggregate([
      { $addFields: { month: { $month: '$dateOfSale' } } },
      { $match: { month: userSentMonth } },
    ]);

    let menClothing, womenClothing, electronics, jewelery;

    menClothing = womenClothing = electronics = jewelery = 0;

    allProducts.forEach((product) => {
      if (product.category === 'jewelery') {
        jewelery++;
      } else if (product.category === 'electronics') {
        electronics++;
      } else if (product.category === "women's clothing") {
        womenClothing++;
      } else {
        menClothing++;
      }
    });

    const pieChartdata = {
      "men's clothing": menClothing,
      "women's clothing": womenClothing,
      jwelery: jewelery,
      electronics: electronics,
    };

    return res.status(200).json({
      success: true,
      pieChartdata,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

exports.allData = async (req, res) => {
  try {
    const userSentMonth = req.params.month;
    let response1 = await fetch(
      `http://localhost:8000/product/statistics/${userSentMonth}`
    );
    response1 = await response1.json();

    let response2 = await fetch(
      `http://localhost:8000/product/bar-chart/${userSentMonth}`
    );
    response2 = await response2.json();

    let response3 = await fetch(
      `http://localhost:8000/product/pie-chart/${userSentMonth}`
    );
    response3 = await response3.json();

    return res.status(200).json({
      statistics: response1,
      'bar-chart': response2,
      'pie-chart': response3,
    });
  } catch (error) {
    return console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
