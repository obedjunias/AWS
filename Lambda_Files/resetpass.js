const mongoose = require('mongoose');
const mongoClient = require('mongodb').MongoClient;
const mongoURI = '';
const bcrypt = require('bcryptjs')
mongoose.Promise = global.Promise;
let isConnected;

function connectToDatabase(){
    return mongoClient.connect(mongoURI,{
        useNewUrlParser : true,
        useMongoClient : true
    }).then(db=>{
        isConnected = db;
        return db;
    }).catch(err=>{
        console.log(err);
    })
}

module.exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    var newPassword = event.newPassword
    var email = event.email
    var confirmPassword = event.confirmPassword

    if(confirmPassword===newPassword){
        bcrypt.hash(newPassword, 12, (err, hash) => {
            if(err){
                console.log(err)
                throw err;
            }
            connectToDatabase().then(client => {
                var db = client.db('dbname')
                db.collection('colname').update({'email': email}, {'password': hash}, (err, res) => {
                    if(err){
                        console.log(err)
                        throw err
                    }else{
                        context.succeed({
                            'message': 'Password updated'
                        })
                    }
                })
            })
        })
    }else{
        context.succeed({
            'message': 'The new password and confirm password does not match'
        })
    }
}