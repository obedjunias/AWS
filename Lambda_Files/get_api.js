const mongoose = require('mongoose');
const mongoClient = require('mongodb').MongoClient;
const mongoURI = '';
mongoose.Promise = global.Promise;
let isConnected;

function connectToDatabase(){
    // if (isConnected){
    //     console.log('Using Existing Connection');
    //     return Promise.resolve();
    // }
    
    return mongoClient.connect(mongoURI,{
        useNewUrlParser : true,
        useMongoClient : true
    }).then(db=>{
        isConnected = db;
        console.log('Using New Connection');
        return db;
    }).catch(err=>{
        console.log(err);
    })
}

module.exports.handler = (event,context,callback) =>{
    context.callbackWaitsForEmptyEventLoop = false;
    
    connectToDatabase().then(client=>{
        var db = client.db(dbname)
        db.collection(collectionname).find(event).toArray((err, result) => {
            if(err){
                throw err
            }
            if(result.length === 0) context.succeed("No Results Found")
            context.succeed(result)
    })
    }).catch(err=>{
        console.log(err)
        return{
            body: JSON.stringify(err),
            statuscode: 404
          }
})
}