const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5eab13e76cf64c2e3452106d')
    .then(user => {
      req.user = user
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://mateus:y9gjs9zs@cluster0-1gqwa.gcp.mongodb.net/shop?retryWrites=true&w=majority")
  .then(result => {
    User.findOne().then(user=>{
      if(!user){
        const user = new User({
          name: 'Mateus',
          email: 'test@test.com',
          cart: []
        })
        user.save()
      }
    })
    app.listen(3000);
  })
  .catch(err => {
    // console.log(err);
  });
