const Product = require('../models/product');
//const Cart = require('../models/cart');
//const CartItem = require('../models/cart-item');

exports.getProducts = (req, res, next) => {
  
  Product.findAll().then(products =>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });

  }).catch(err =>{
      console.log(err);
  });
  
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  
  Product.findByPk(prodId).then((product) => {
    //console.log(product[0]);
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  })
  .catch(err=> {
    console.log(err);
  });
};

exports.getIndex = (req, res, next) => {
  
  Product.findAll()
  .then(products =>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err =>{
    console.log(err);
  });
  
  
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
    .then(products => {
       console.log('cart ...', products);
        if (products)
         return products;
        else 
        return new Promise((resolve,reject) =>{
           resolve([]);
        })  
     })
    .then(cartProducts => {

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });

    }) 
    .catch(err => {
      console.log(err);
    })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId).then(product=>{
    return req.user.addToCart(product);
  })
  .then(result =>{
    console.log(result);
    res.redirect('/cart');
  })
  .catch(err=>{
    console.log(err);
  })
  
 
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const db = 
  req.user
     .deleteProductInCart(prodId)
     .then(result =>{
       //console.log(result);
       res.redirect('/cart');
     })
     .catch(err => {
       console.log(err);
   })

};


exports.postOrder =(req,res,next) => {
  let fetchCart ;
  req.user
    .getCart()
    .then(cart =>{
       fetchCart = cart;
       return cart.getProducts();
    }).then(products => {
        return req.user
          .createOrder()
          .then(order =>{
             return order.addProducts(products.map(product => {
                product.orderItem = {quantity: product.cartItem.quantity, price: product.price }
                return product;
              }));
          })
          .catch(err => {
            console.log(err);
          });

    })
    .then(result =>{
      return fetchCart.setProducts(null);
    })
    .then(result =>{
      //console.log(result);

       res.redirect('/orders');
    })
    .catch(err => {
      console.log(err);
  });
  
 
}

exports.getOrders = (req, res, next) => {

   req.user
    .getOrders({include: [
      {
        model: Product,
        as: 'products'
      }
    ]})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};


exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
