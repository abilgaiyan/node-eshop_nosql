const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback) =>{
    MongoClient
    .connect('mongodb+srv://ajayb:eshop@node-nosql-p4wwm.mongodb.net/node-eshop?retryWrites=true')
    .then(client =>{
        console.log('Connected...');
        _db = client.db();
        callback();
        
    })
    .catch(err =>{
        console.log(err);
        throw err;
    });
}

getDb = () =>{
  if (_db){
      return _db;
  }

  throw 'Mongodb is not connected';
}


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;