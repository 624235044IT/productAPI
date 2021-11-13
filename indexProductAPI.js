var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var apiversion = '/api/v1';


//MYSQL Connection
var db = require('./config/db.config');
const { verify } = require('jsonwebtoken');


var port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

//Get all products
app.get(apiversion + '/products', verify, function (req, res) {

  try {

    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    db.query('SELECT * FROM products', function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: 'products list', data: results });
    });

  } catch {
    return res.status(401).send("False")
  }


});

//put products by Id
app.put(apiversion + '/product/:productId', verify, function (req, res) {

  try {

    var productId = Number(req.body.productId);
    var productName = req.body.productName;
    var productDescription = req.body.productDescription;
    var productPrice = Number(req.body.productPrice);
    var productPicture = req.body.productPicture;


    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    db.query(`UPDATE products 
            Set
               productId = ${productId},
               productName = '${productName}',
               productDescription = '${productDescription}',
               productPrice = ${productPrice},
               productPicture = '${productPicture}'
  
            where productId= ${productId};`, function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: ' Modified product' });
    });
  } catch {
    return res.status(401).send("False")
  }

});
app.post(apiversion + '/product', verify, function (req, res) {

  try {
    
    var productName = req.body.productName;
    var productDescription = req.body.productDescription;
    var productPrice = req.body.productPrice;
    var productPicture = req.body.productPicture;

    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    db.query(`INSERT INTO products 
    (productName, productDescription, productPrice, productPicture) 
    VALUES ('${productName}','${productDescription}',${productPrice}, 
    '${productPicture}');`, function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: 'Insert new product' });
    });

  } catch {
    return res.status(401).send("False")
  }

});



//Delete products by id
app.delete(apiversion + '/product/:productId', verify, function (req, res) {

  try {

    var productId = req.params.productId;

    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    db.query(`DELETE from products WHERE productId =${productId};`, function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: ' Delete product' });
    });
  } catch {
    return res.status(401).send("False")
  }



});
app.post(apiversion + '/upload', verify, (req, res) => {

  try {
    if (!req.files) {
      return res.status(500).send({ msg: "file is not found" })
    }

    const myFile = req.files.file;

    myFile.mv(`${productPicturepath}${myFile.name}`, function (err) {

      if (err) {
        console.log(err)
        return res.status(500).send({ msg: "Error occured" });
      }

      return res.send({ name: myFile.name, path: `/${myFile.name}` });

    });
  } catch {
    return res.status(401).send("False")
  }

});

app.listen(port, function () {
  console.log("Server is up and running...");
});


