const mongoose = require('mongoose');
const mongoClient = require('mongodb').MongoClient;
const mongoURI = ''
const bcrypt = require('bcryptjs')
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
    var name = event.name
    var dept = event.dept
    var email = event.email
    var sem =event.sem
    var usn =event.usn
    bcrypt.hash(usn, minchars, (err, hash) => {
        if(err){
            console.log(err)
        }
        connectToDatabase().then(client=>{
            var db = client.db('dbname')
            db.collection('users').find({'email': email}).then((res, err) => {
                if(err){
                    throw err
                }
                if(res){
                    context.succeed({
                        'message': 'Student already exists'
                    })
                }else{
                    db.collection('users').insertOne({
                        'name': name,
                        'usn': usn,
                        'password': hash,
                        'dept': dept,
                        'email': email,
                        "sem": sem,
                        'type': 'student',
                    },(err,result) => {
                        if(err){
                            throw err
                        }
                        else{
                            context.succeed({
                                'message': "Success!! Student added"
                            })
                        }
                    })
                }
            })
        }).catch(err=>{
            console.log(err)
        })
    })
}