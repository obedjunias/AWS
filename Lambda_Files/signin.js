const mongoose = require('mongoose')
const mongoClient = require('mongodb').MongoClient
const mongoURI = ''
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
mongoose.Promise = global.Promise;
let isConnected

let privateKey = 'privatekey'
const EXPIRESIN = '4h'

function connectToDatabase() {
    // if (isConnected) {
    //   console.log('=> using existing database connection');
    //   return Promise.resolve();
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
};

module.exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    var email = JSON.parse(JSON.stringify(event.email))
    var password = JSON.parse(JSON.stringify(event.password))

    connectToDatabase().then(client => {
        var db = client.db(dbname)
        db.collection(collectionname).find({'email': email}).toArray((err, result) => {
            if(err){
                console.log(err)
            }
            console.log(result[0])
            bcrypt.compare(password, result[0].password, (err, res) => {
                console.log('here')
                if(err){
                    throw err
                }
                if(res){
                    context.succeed({
                        success: true,
                        messsage: 'login successful',
                        token: jwt.sign(result[0], privateKey, {expiresIn: EXPIRESIN}, {alogrithm: "algorithmhere"}),
                        res: result[0]
                    })
                }else{
                    context.succeed({
                        success: false,
                        messsage: 'Incorrect password',
                    })
                }
            })
        })
    }).catch(err => {
        console.log(err)
    })
}