const mongoose = require('mongoose');
const mongoClient = require('mongodb').MongoClient
const mongoURI = 'mongodb+srv://dbuser:dbpassword@cluster0-xnifl.mongodb.net/test?retryWrites=true&w=majority'
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
    db.collection('courses').aggregate(
      [{
        $match: event
        
      },
      {
        $lookup:
        {from: 'videos',
        localField: 'courseCode',
        foreignField: 'Course Code',
        as: 'videoDeptDetails'}
      }]).toArray((err,result) => {
      if(err){
        throw err
      }
      else{
        if(result.length === 0)
        context.succeed("No Result Found")
      context.succeed(result)}
    })
  }).catch(err => {
    console.log(err)
    return{
      body: JSON.stringify(err),
      statuscode: 404
    }
    
})
}