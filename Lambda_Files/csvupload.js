const csvjson = require('csvjson')
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


exports.handler = function (event, context,callback){
context.callbackWaitsForEmptyEventLoop = false;
var options = {
  delimiter : ',', 
  quote     : '"' 
}
let request = event;
let buffer = new Buffer(request.base64String, 'base64');
var text = buffer.toString('ascii')
var json = csvjson.toObject(text,options)
for(var i=0;i<json.length;i++){
    json[i]['status'] = 'offline';
 console.log(json[i])
}
connectToDatabase().then(client=>{
        var db = client.db('dbname')
                db.collection('colname').insertMany(json).then(res => {
                    context.succeed({
                        'message': 'Success'
                    })
                }).catch(err => {
                    throw err
                })
        
            
    }).catch(err=>{
        console.log(err)
})


}