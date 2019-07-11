const mongoose = require('mongoose');
const mongoClient = require('mongodb').MongoClient;
const mongoURI = 'mongodb+srv://<username>:<password>@cluster0-xnifl.mongodb.net/test?retryWrites=true&w=majority';
mongoose.Promise = global.Promise;
let isConnected;

function connectToDatabase(){
    if (isConnected){
        console.log('Using Existing Connection');
        return Promise.resolve();
    }
    
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

module.exports.handler = (event,context,callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var jsonContents = JSON.parse(JSON.stringify(event));
    
    connectToDatabase().then(client=>{
        var db = client.db('codeiodb')
        db.collection('mapping').insertOne(jsonContents,(err,result) => {
            if(err){
                throw err
            }
            else{
                console.log(result)
            context.succeed("Success")
            }
        })
    }).catch(err=>{
        console.log(err)
})
}
