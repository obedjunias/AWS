const mongoose = require('mongoose');
const mongoClient = require('mongodb').MongoClient;
const mongoURI = ''
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

module.exports.handler = (event,context,callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var jsonContents = JSON.parse(JSON.stringify(event));
    
    connectToDatabase().then(client=>{
        var db = client.db('dbname')
        db.collection('colname').find({"classroom":jsonContents.classroom}).toArray().then(res => {
            if(res.length != 0){
                context.succeed({
                    'message': "Mapping for this room already exists"
                })
            }else{
                 db.collection('mapping').insertOne(jsonContents).then(res => {
                     context.succeed({
                         'message': "Mapping added!!"
                     })
                 }).catch(err => {
                     throw err
                 })
            }
        })
    }).catch(err=>{
        console.log(err)
})
}