const getDb = require('../util/database').getDb
const mongodb = require('mongodb')

class User{
  constructor(username, email, cart, id){
    this.name = username
    this.email = email
    this.cart = cart    
    this._id = id
  }

  save(){
    const db = getDb()
    return db.collection('users').insertOne(this)
  }

  addToCart(product){
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId === product._id
    })
    let newQuantity = 1

    if(cartProduct >= 0){
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
    }

    const updatedCart = {items: [{productId: new mongodb.ObjectId(product._id), quantity: newQuantity}]}
    const db= getDb()
    return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)},{$set: {cart: updatedCart}})
  }

  static findById(userId){
    const db = getDb()
    return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)}).then().catch(err => {
      console.log(err);
    });
  }
}

module.exports = User