const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title,price,imageUrl,description);
  product.save()
       .then(result =>{
        console.log('New product created');
          res.redirect('/admin/products');
       }

       )
       .catch(err=>{
        console.log(err);
      });
    
  //  req.user.createProduct({
  //   title: title,
  //   price: price,
  //   imageUrl: imageUrl,
  //   description: description
  //  })
  //  .then(result => {
  //    // console.log(result);
  //    console.log('New product created');
  //    res.redirect('/admin/products');
  //  }).catch(err => {
  //    console.log(err);
  //  });
  
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
  .then( product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    })
   }
  )
  .catch(err =>{
    console.log(err);
  })
  

};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  

  Product.findByPk(prodId)
  .then(product =>{
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;

    const editproduct = new Product(product.title,product.price,product.imageUrl,product.description,product._id);  
    return editproduct.save();
  })
  .then(result =>{
    console.log('Product updated...');
    res.redirect('/admin/products');
  })
  .catch(err =>{
    console.log(err)
  }) 

};

exports.getProducts = (req, res, next) => {
  
  Product.findAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
     
  })
  .catch(err =>{
    console.log(err);
  });
  
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteById(prodId).then(result =>{
    console.log('Product Deleted....');
     res.redirect('/admin/products');
  
  })
  .catch(err => {
    console.log(err);
  }) ;
  // Product.findByPk(prodId)
  //        .then(product =>{
  //          return product.destroy();
  //        })
  //        .then(result =>{
  //          console.log('Product Deleted....');
  //          res.redirect('/admin/products');

  //        })
  //        .catch(err => {
  //          console.log(err);
  //        });


  
 };
