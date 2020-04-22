const getDb = require('../util/database').getDb
const mongodb = require('mongodb')

class User{
  constructor(username, email, id){
    this.name = username
    this.email = email
    this._id = id
  }

  save(){
    const db = getDb()
    return db.collection('users').insertOne(this)
  }

  static findById(userId){
    const db = getDb()
    return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)}).then().catch(err => {
      console.log(err);
    });
  }
}

module.exports = User