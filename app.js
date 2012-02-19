var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');

var app = express.createServer();

// database

mongoose.connect('mongodb://localhost/ecomm_database');

// config

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var Schema = mongoose.Schema; //Schema.ObjectId

// Schemas

var Sizes = new Schema({
    size: { type: String, required: true },
    available: { type: Number, required: true, min: 0, max: 1000 },
    sku: { 
        type: String, 
        required: true, 
        validate: [/[a-zA-Z0-9]/, 'Product sku should only have letters and numbers']
    },
    price: { type: Number, required: true, min: 0 }
});

var Images = new Schema({
    kind: { 
        type: String, 
        enum: ['thumbnail', 'catalog', 'detail', 'zoom'],
        required: true
    },
    url: { type: String, required: true }
});

var Variants = new Schema({
    color: String,
    images: [Images],
    sizes: [Sizes]
});

var Categories = new Schema({
    name: String
});

var Catalogs = new Schema({
    name: String
});

// Product Model

var Product = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    style: { type: String, unique: true },
    images: [Images],
    categories: [Categories],
    catalogs: [Catalogs],
    variants: [Variants],
    modified: { type: Date, default: Date.now }
});

// validation

Product.path('title').validate(function (v) {
    console.log("validate title");
    console.log(v);
    return v.length > 10 && v.length < 70;
});

Product.path('style').validate(function (v) {
    console.log("validate style");
    console.log(v);
    return v.length < 40;
}, 'Product style attribute is should be less than 40 characters');

Product.path('description').validate(function (v) {
    console.log("validate description");
    console.log(v);
    return v.length > 10;
}, 'Product description should be more than 10 characters');

var ProductModel = mongoose.model('Product', Product);

/* Product Document 
[
{  
  "title": "My Awesome T-shirt",  
  "description": "All about the details. Of course it's black.",  
  "images": [  
    {  
      "kind": "thumbnail",  
      "url": "images/products/1234/main.jpg"  
    }  
  ],  
  "categories": [  
      { "name": "Clothes" },  
      { "name": "Shirts" }  
  ],  
  "style": "1234",  
  "variants": [  
    {  
      "color": "Black",  
      "images": [  
        {  
          "kind": "thumbnail",  
          "url": "images/products/1234/thumbnail.jpg"  
        },  
        {  
          "kind": "catalog",  
          "url": "images/products/1234/black.jpg"  
        }  
      ],  
      "sizes": [  
        {  
          "size": "S",  
          "available": 10,  
          "sku": "CAT-1234-Blk-S",  
          "price": 99.99  
        },  
        {  
          "size": "M",  
          "available": 7,  
          "sku": "CAT-1234-Blk-M",  
          "price": 109.99  
        }  
      ]  
    }  
  ],  
  "catalogs": [  
      { "name": "Apparel" }  
  ]  
}
]
*/


// REST api

app.get('/api', function (req, res) {
  res.send('Ecomm API is running');
});

// POST to CREATE
app.post('/api/products', function (req, res) {
  var product;
  console.log("POST: ");
  console.log(req.body);
  product = new ProductModel({
    title: req.body.title,
    description: req.body.description,
    style: req.body.style,
    images: req.body.images,
    categories: req.body.categories,
    catalogs: req.body.catalogs,
    variants: req.body.variants
  });
  product.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(product);
});

// PUT to UPDATE

// Bulk update
app.put('/api/products', function (req, res) {
    var i, len = 0;
    console.log("is Array req.body.products");
    console.log(Array.isArray(req.body.products));
    console.log("PUT: (products)");
    console.log(req.body.products);
    if (Array.isArray(req.body.products)) {
        len = req.body.products.length;
    }
    for (i = 0; i < len; i++) {
        console.log("UPDATE product by id:");
        for (var id in req.body.products[i]) {
            console.log(id);
        }
        ProductModel.update({ "_id": id }, req.body.products[i][id], function (err, numAffected) {
            if (err) {
                console.log("Error on update");
                console.log(err);
            } else {
                console.log("updated num: " + numAffected);
            }
        });
    }
    return res.send(req.body.products);
});

// Single update
app.put('/api/products/:id', function (req, res) {
  return ProductModel.findById(req.params.id, function (err, product) {
    product.title = req.body.title;
    product.description = req.body.description;
    product.style = req.body.style;
    product.images = req.body.images;
    product.categories = req.body.categories;
    product.catalogs = req.body.catalogs;
    product.variants = req.body.variants;
    return product.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(product);
    });
  });
});

// GET to READ

// List products
app.get('/api/products', function (req, res) {
  return ProductModel.find(function (err, products) {
    if (!err) {
      return res.send(products);
    } else {
      return console.log(err);
    }
  });
});

// Single product
app.get('/api/products/:id', function (req, res) {
  return ProductModel.findById(req.params.id, function (err, product) {
    if (!err) {
      return res.send(product);
    } else {
      return console.log(err);
    }
  });
});

// DELETE to DESTROY

// Bulk destroy all products
app.delete('/api/products', function (req, res) {
  ProductModel.remove(function (err) {
    if (!err) {
      console.log("removed");
      return res.send('');
    } else {
      console.log(err);
    }
  });
});

// remove a single product
app.delete('/api/products/:id', function (req, res) {
  return ProductModel.findById(req.params.id, function (err, product) {
    return product.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

// launch server

app.listen(4242);
