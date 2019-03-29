const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectID;
class User {
  constructor(username, email, id, cart) {
    this.name = username;
    this.email = email;
    this._id = id ? new ObjectId(id) : null;
    this.cart = cart ? cart : {}; // items:[]
  }

  save() {
    const db = getDb();
    if (this._id) {
      return db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: this })
        .then(result => {
          console.log("User Updated...");
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      return db
        .collection("users")
        .insertOne(this)
        .then(result => {
          console.log("New User created...");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  addToCart(product) {
      
      
      if (!this.cart.items){
          this.cart.items = [];
      }
      //console.log('addtocart->',this.cart);
    const productIndexinCart = this.cart
      .items
      .findIndex(p=> p.productId.toString() === product._id.toString());  
    
      const updatedCartItems = [...this.cart.items];
      let newQuantity =1;
    if (productIndexinCart >=0){
        newQuantity =  this
                      .cart
                      .items[productIndexinCart].quantity + 1;
        updatedCartItems[productIndexinCart].quantity = newQuantity;              
    }
    else{
      updatedCartItems.push({
         productId: new ObjectId(product._id), 
         quantity: newQuantity 
        })
    }
    
    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

   getCart(){
      const db = getDb();
      const productIds = this.cart.items.map(item => {
        return item.productId;
      })
      return db
        .collection('products')
        .find({_id: {$in: productIds}})
        .toArray()
        .then(products =>{
          return products.map(product =>{
            return {
              ...product,
              quantity: this.cart.items.find(item =>{
                return item.productId.toString() === product._id.toString()
              }).quantity
            }
          })
        })
        .catch(err=>{
          console.log(err);
        });
      //return this.cart;
  }

  deleteProductFromCart(productId){
    const db = getDb();
    
    const updatedCartItems = [...this.cart.items];
    const productIndexinCart = updatedCartItems.findIndex(item =>{
      item.productId.toString() === productId.toString()
    })
    updatedCartItems.splice(productIndexinCart, 1);
    const updatedCart ={items: updatedCartItems}
    return db
    .collection('users')
    .updateOne(
      { _id: new ObjectId(this._id)},
      {$set: {cart: updatedCart}}
    )

          
  }
   
  static findByPk(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        //console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = User;
