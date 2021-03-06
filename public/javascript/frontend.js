PX = window.PX || {};

// model
PX.Product = Backbone.Model.extend({
    defaults: {
        title: null,
        description: null
    }
});

// collection
(function () {
    var ProductList;

    ProductList = Backbone.Collection.extend({
        model: PX.Product,
        url: '/api/products',
        initialize: function () {
            this.fetch({
                success: this.fetchSuccess,
                error: this.fetchError
            });
            this.deferred = new $.Deferred();
        },
        deferred: Function.constructor.prototype,
        fetchSuccess: function (collection, response) {
            collection.deferred.resolve();
        },
        fetchError: function (collection, response) {
            throw new Error("Products fetch did get collection from API");
        }
    });

    PX.products = new ProductList();
    ProductList = null;
}());


PX.ProductListItemView = Backbone.View.extend({
    tagName: "li",
    className: "product",
    events: {
        "click": "showProductDetails"
    },
    initialize: function (options) {
        this.template = $('#product-template').html();
    },
    render: function () {
        var markup = Mustache.to_html(this.template, this.model.toJSON());
        this.$el.html(markup).attr('id',this.model.get('_id'));
        return this;
    },
    showProductDetails: function(event) {
        var targ = $(event.target), pid = targ.attr(id), dest;
        event.preventDefault();
        dest = "products/" + ( (pid) ? pid : targ.closest('li').attr('id') );
        console.log("Show product details: " + pid);
        PX.app.navigate(dest);
    }
});

PX.ProductListView = Backbone.View.extend({
    tagName: "ul",
    className: "products",
    render: function () {
        for (var i = 0; i < this.collection.length; i++) {
            this.renderItem(this.collection.models[i]);
        };
        $(this.container).find(this.className).remove();
        this.$el.appendTo(this.options.container);
        return this;
    },
    renderItem: function (model) {
        var item = new PX.ProductListItemView({
            "model": model
        });
        item.render().$el.appendTo(this.$el);
    }
});

PX.ProductDetailsView = Backbone.View.extend({
    el: "#container",
    initialize: function (options) {
        this.render();
    },
    render: function () {
        this.$el.html("TODO ADD A PRODUCT DETAILS Model, View and Template")
    }
});

// application
PX.App = Backbone.Router.extend({
    routes: {
        "/": "listProducts",
        "list": "listProducts",
        "products/:id": "showProductDetails"
    },
    //initialize: function (options) {},
    listProducts: function () {
        var productsList = new PX.ProductListView({
            "container": $('#container'),
            "collection": PX.products
        });
        PX.products.deferred.done(function () {
            productsList.render();
        });
    },
    showProductDetails: function () {
        var productDetails = new PX.ProductDetailsView();
    }
});

// bootstrap
PX.app = new PX.App();
Backbone.history.start();