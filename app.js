const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');


const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

const User = require('./models/user');

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// add a middleware to add a user with request. 
app.use((req,res,next)=>{
    User.findByPk('5c99c565e32a1e1c74b26a3e')
    .then(user=>{
      req.user = new User(user.name, user.email,user._id, user.cart);
      //console.log('user...', req.user);
      next();
    })
    .catch(err=> {
      console.log(err);
    });
    
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);

})

