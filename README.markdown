# Build a RESTful api using node - ecommerce example

## API for ecommerce application

### Design

* Simple API design and pragmatic REST - only 2 base URLs per resource  
* Keep verbs out of your base URLs  
* Our HTTP verbs are POST, GET, PUT, and DELETE (CRUD - Create, Read, Update, Delete)  
* Concrete names are better than abstract

Example : two resources (/products and /products/1) and the four HTTP verbs

<table>
    <tr>
        <th>Resource</th>
        <th>Post<br>(create)</th>
        <th>Get<br>(read)</th>
        <th>Put<br>(update)</th>
        <th>Delete<br>(delete)</th>
    </tr>
    <tr>
        <td>/products</td>
        <td>create a new product</td>
        <td>list products</td>
        <td>bulk update products</td>
        <td>delete all products</td>
    </tr>
    <tr>
        <td>/products/1234</td>
        <td>error</td>
        <td>show 1234</td>
        <td>if exists update 1234, else error</td>
        <td>delete 1234</td>
    </tr>
</table>


### Nouns

#### Products

**Product:**

    Id,  
    Title,  
    Description,  
    Image URL,  
    Categories: [ { Name } ],  
    Style Number,  
    Colors: [  
      {  
        Name,  
        Images: [  
          { Size, URL }  
        ],  
        Sizes: [  
          { Size, Available, SKU, Price }  
        ],  
      }  
    ]

**Urls:**

* /products *- list*  
* /products/:id *- single*  


### Data: MongoDB using Mongoose with Express framework running with Node.js

Models are defined by passing a Schema instance to [mongoose.model][mongoosejs model].


### References

* [API design nouns are good, verbs are bad][nouns are good verbs are bad]
* [Models are defined by passing a Schema instance to mongoose.model][mongoosejs model]
* [SchemaTypes take care of validation, casting, defaults, and other general options in our models][schema types]
* [Embedded documents are documents with schemas of their own that are part of other documents][embedded documents]
* [Backbone Todo boilerplates demonstrating integration with Node.js, Express, MongoDB][backbone boilerplates]

[nouns are good verbs are bad]: http://blog.apigee.com/detail/restful_api_design_nouns_are_good_verbs_are_bad/ "API design nouns are good, verbs are bad"

[mongoosejs model]: http://mongoosejs.com/docs/model-definition.html "Models are defined by passing a Schema instance to mongoose.model"

[schema types]: http://mongoosejs.com/docs/schematypes.html "SchemaTypes take care of validation, casting, defaults, and other general options in our models"

[embedded documents]: http://mongoosejs.com/docs/embedded-documents.html "Embedded documents are documents with schemas of their own that are part of other documents"

[backbone boilerplates]: https://github.com/addyosmani/backbone-boilerplates "Backbone Todo boilerplates demonstrating integration with Node.js, Express, MongoDB"


