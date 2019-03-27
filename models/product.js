const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;
class Product {
  constructor(title, price, imageUrl, description, id){
    this.title = title;
    this.price=price;
    this.imageUrl=imageUrl;
    this.description = description;
    this._id = id ? new ObjectId(id) : null;
  }

  save(){
    const db = getDb();
    if (this._id){
      return db
       .collection('products')
       .updateOne({_id: this._id },{$set: this})
       .then(result=>{
         console.log('Update successfull');
       })
       .catch(err => {
         console.log(err);
       })
    }
    else{
    return db
      .collection('products')
      .insertOne(this)
      .then(result =>{
        console.log('Record Added successfully');
      })
      .catch(err =>{
        console.log(err);
      });
    }
  }

  static findAll(){
    const db = getDb();
     return db
           .collection('products')
           .find()
           .toArray()
           .then(products => {
             //console.log(products);
             return products;
           })
           .catch(err =>{
      console.log(err);
    });
  }

  static findByPk(prodId){
    const db = getDb();
    return db
           .collection('products')
           .find({_id: new mongodb.ObjectId(prodId)})
           .next()
           .then(product =>{
             //console.log('findByPk',product);
             return product;
           })
           .catch(err =>{
             console.log(err);
           })  
  }

  static deleteById(prodId){
    const db = getDb();
    return db
    .collection('products')
    .deleteOne({_id: new ObjectId(prodId)})
    .then(result=>{
      console.log('Product Deleted');
    })
    .catch(err=>{
      console.log(err);
    })
  }
  
}


module.exports = Product;