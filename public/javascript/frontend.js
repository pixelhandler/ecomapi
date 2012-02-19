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


PX.ProductView = Backbone.View.extend({
    tagName: "li",
    className: "product",
    initialize: function (options) {
        this.template = $('#product-template').html();
    },
    render: function () {
        var markup = Mustache.to_html(this.template, this.model.toJSON());
        this.$el.html(markup).attr('id',this.model.get('_id'));
        return this;
    }
});

PX.ProductListView = Backbone.View.extend({
    tagName: "ul",
    className: "products",
    // initialize: function (options) {
    //     this.container = options.container;
    // },
    render: function () {
        var i, len = this.collection.length;
        for (i=0; i < len; i++) {
            this.renderItem(this.collection.models[i]);
        };
        $(this.container).find(this.className).remove();
        this.$el.appendTo(this.options.container);
        return this;
    },
    renderItem: function (model) {
        var item = new PX.ProductView({
            "model": model
        });
        item.render().$el.appendTo(this.$el);
    }
});

// application
PX.App = Backbone.Router.extend({
    routes: {
        "/": "listProducts",
        "list": "listProducts"
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
    }
});

// bootstrap
PX.app = new PX.App();
Backbone.history.start();
