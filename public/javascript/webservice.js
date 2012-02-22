// webservice.js
PX = window.PX || {};

// AJAX

// Create
PX.postProductsHandler = function () {
    var dataObj = $('textarea[name="post_content"]').val();
    PX.clearOutput();
    $.post("/api/products", dataObj, function(data, textStatus, jqXHR) { 
        console.log("Post resposne:"); 
        console.dir(data); 
        console.log(textStatus); 
        console.dir(jqXHR); 
        PX.outputHandler(data);
    });
};

// Read
PX.getProductsHandler = function (id) {
    var url = (id) ? "/api/products/" + id : "/api/products";
    PX.clearOutput();
    $.get(url, function(data, textStatus, jqXHR) { 
        console.log("Post resposne:"); 
        console.dir(data); 
        console.log(textStatus); 
        console.dir(jqXHR); 
        PX.outputHandler(data);
    });
};

// Update
PX.updateProductsHandler = function (id) {
    var dataObj = JSON.parse($('textarea[name="post_content"]').val());
    PX.clearOutput();
    $.ajax({
        url: "/api/products/" + id, 
        type: "PUT",
        data: dataObj, 
        success: function(data, textStatus, jqXHR) { 
            console.log("PUT resposne:"); 
            console.dir(data); 
            console.log(textStatus); 
            console.dir(jqXHR); 
            PX.outputHandler(data);
        }
    });
};

// Delete
PX.deleteProductsHandler = function (id) {
    var serviceUrl = "/api/products";
    PX.clearOutput();
    $.ajax({
        url: (id) ? serviceUrl + "/" + id : serviceUrl, 
        type: "DELETE", 
        success: function(data, textStatus, jqXHR) { 
            console.dir(data); 
            PX.outputHandler(data);
        }
    });
};

// handlers

PX.webserviceFormHandler = function (e) {
    var serviceOption, pid;
    e.preventDefault();
    serviceOption = $("input:radio['name=service']:checked").val();
    pid = $('#_id').val();
    if (console) { console.log("service", serviceOption); }
    switch (serviceOption) {
    case "delete_products" :
        PX.deleteProductsHandler();
        break;
    case "delete_product" :
        PX.deleteProductsHandler(pid);
        break;
    case "update_products" :
        PX.updateProductsHandler(pid);
        break;
    case "update_product" :
        PX.updateProductsHandler(pid);
        break;
    case "get_products" :
        PX.getProductsHandler();
        break;
    case "get_product" :
        PX.getProductsHandler(pid);
        break;
    case "post_products" :
        PX.postProductsHandler();
        break;
    case "post_error" :
        throw new Error('cannot post /api/products/'+ pid);
        break;
    }
};

PX.clearOutput = function () {
    $('#output').val("");
};
PX.outputHandler = function (data) {
    $('#output').val(JSON.stringify(data));
};

// Fixtures
PX.addFixturesHandler = function (e) {
    e.preventDefault();
    PX.clearOutput();
    PX.deleteProductsHandler();
    $.each(PX.fixtures, function() {
        $.post("/api/products", this, function(data, textStatus, jqXHR) { 
            console.log("Post response:"); console.dir(data); console.log(textStatus); console.dir(jqXHR); 
            PX.outputHandler(data);
        });
    });
};

// Events

$('#add_fixtures').on('click', PX.addFixturesHandler);
$('#submit').on('click', PX.webserviceFormHandler);
$('#webservice').on('submit', PX.webserviceFormHandler);

// data

PX.fixtures = [
    {
      "id": 0,
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
    },
    {
      "id": 1,
      "title": "My Other T-shirt",  
      "description": "All about the details. Almost as nice as my Awesome T-Shirt",  
      "images": [  
        {  
          "kind": "thumbnail",  
          "url": "images/products/1235/main.jpg"  
        }  
      ],  
      "categories": [  
          { "name": "Clothes" },
          { "name": "Shirts" } 
      ],  
      "style": "1235",  
      "variants": [  
        {  
          "color": "Blue",  
          "images": [  
            {  
              "kind": "thumbnail",  
              "url": "images/products/1235/thumbnail.jpg"  
            },
            {  
              "kind": "catalog",  
              "url": "images/products/1235/blue.jpg"  
            }  
          ],  
          "sizes": [  
            {  
              "size": "S",  
              "available": 8,  
              "sku": "CAT-1235-Blu-S",  
              "price": 79.99  
            },
            {
              "size": "M",  
              "available": 9,  
              "sku": "CAT-1235-Blu-M",  
              "price": 89.99  
            },
            {
              "size": "L",  
              "available": 12,  
              "sku": "CAT-1235-Blu-L",  
              "price": 99.99  
            }  
          ]  
        }  
      ],
      "catalogs": [
          { "name": "Apparel" }
      ]  
    },
    {
      "id": 2,
      "title": "My Gray T-shirt",  
      "description": "All about the details. Not too much color here, just gray.",  
      "images": [  
        {  
          "kind": "thumbnail",  
          "url": "images/products/1236/main.jpg"  
        }  
      ],  
      "categories": [  
          { "name": "Clothes" },
          { "name": "Shirts" } 
      ],  
      "style": "1236",  
      "variants": [  
        {  
          "color": "Gray",  
          "images": [  
            {  
              "kind": "thumbnail",  
              "url": "images/products/1236/thumbnail.jpg"  
            },
            {  
              "kind": "catalog",  
              "url": "images/products/1236/gray.jpg"  
            }  
          ],  
          "sizes": [  
            {  
              "size": "S",  
              "available": 25,  
              "sku": "CAT-1236-Gra-S",  
              "price": 19.99  
            },
            {
              "size": "L",  
              "available": 16,  
              "sku": "CAT-1236-Gra-L",  
              "price": 29.99  
            }  
          ]  
        }  
      ],
      "catalogs": [
          { "name": "Apparel" }
      ]  
    },
    {
      "id": 3,
      "title": "My Red Hot T-shirt",  
      "description": "All about the details. Red Hot T, get 'em while they're hot.",  
      "images": [  
        {  
          "kind": "thumbnail",  
          "url": "images/products/1237/main.jpg"  
        }  
      ],  
      "categories": [  
          { "name": "Clothes" },
          { "name": "Shirts" } 
      ],  
      "style": "1237",  
      "variants": [  
        {  
          "color": "Red",  
          "images": [  
            {  
              "kind": "thumbnail",  
              "url": "images/products/1237/thumbnails/red.jpg"  
            },
            {  
              "kind": "catalog",  
              "url": "images/products/1237/red.jpg"  
            }  
          ],  
          "sizes": [  
            {  
              "size": "S",  
              "available": 25,  
              "sku": "CAT-1237-Red-S",  
              "price": 19.99  
            },
            {
              "size": "L",  
              "available": 16,  
              "sku": "CAT-1237-Red-L",  
              "price": 29.99  
            }  
          ]  
        },
        {  
          "color": "White",  
          "images": [  
            {  
              "kind": "thumbnail",  
              "url": "images/products/1237/thumbnails/white.jpg"  
            },
            {  
              "kind": "catalog",  
              "url": "images/products/1237/white.jpg"  
            }  
          ],  
          "sizes": [  
            {  
              "size": "M",  
              "available": 7,  
              "sku": "CAT-1237-Whi-M",  
              "price": 18.99  
            },
            {
              "size": "L",  
              "available": 8,  
              "sku": "CAT-1237-Whi-L",  
              "price": 27.99  
            }  
          ]  
        }  
      ],
      "catalogs": [
          { "name": "Apparel" }
      ]  
    }
];