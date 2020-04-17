const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = (cb) => {
  MongoClient.connect('mongodb+srv://mateus:y9gjs9zs@cluster0-1gqwa.gcp.mongodb.net/shop?retryWrites=true&w=majority')
  .then(client => {
    console.log('Connected!')
    _db = client.db()
    cb(client)
  })
  .catch(e => {
    console.log(e)
    throw e
  })
}

const getDb = () => {
  if(_db){
    return _db
  }
  throw 'No database found!'
}


exports.getDb = getDb
exports.mongoConnect = mongoConnect
 