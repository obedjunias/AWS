const mongoose = require('mongoose');
const mongoClient = require('mongodb').MongoClient
const mongoURI = 'mongodb+srv://<username>:<password>@cluster0-xnifl.mongodb.net/test?retryWrites=true&w=majority'
mongoose.Promise = global.Promise;
let isConnected

function connectToDatabase() {
  if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }

  return mongoClient.connect(mongoURI, { 
    useNewUrlParser: true , 
    useMongoClient: true
  }).then(db => { 
      isConnected = db
      console.log('=> using new database connection');
      return db
    }).catch(err => {
      console.log(err)
    })
};

module.exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then((client) => {
    var db = client.db('codeiodb')
    console.log(event)
    db.collection('users').find(event).toArray(function(err, result){
      if(err){
        throw err
      }
      // db.close()
      context.succeed(result)
    })
  }).catch(err => {
    console.log(err)
    return{
      body: JSON.stringify(err),
      statuscode: 404
    }
  })
}