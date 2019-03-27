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
      console.log(this.cart);
      
      if (!this.cart.items){
          this.cart.items = [];
      }
    const productIndexinCart = this.cart.items.findIndex(p=> p._id.toString() === product._id.toString())  
    let newQuantity =1;
    if (productIndexinCart >=0){
        newQuantity =  this.cart.items[productIndexinCart].quantity + 1;
    }
    const updatedCart = { items: [{ productId: new ObjectId(product._id), quantity: newQuantity }] };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  static getCart(){
      return this.cart;
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
