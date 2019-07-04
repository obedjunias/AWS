const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://dbuser:dbuser@cluster0-shard-00-00-faxde.mongodb.net:27017,cluster0-shard-00-01-faxde.mongodb.net:27017,cluster0-shard-00-02-faxde.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'; 
 
// Database Name
const dbName = 'mydb';
 
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(dbName);
 
  updateDocument(db, function() {
    findDocuments(db, function() {
      client.close();
    });
  });
});
const updateDocument = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('studentdata');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ USN :"1BM17CS005" }
      , { $set: { sem:4 , age:20} }, function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      console.log("Updated the document with the field a equal to 2");
      callback(result);
    });
}
    const findDocuments = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('studentdata');
        // Find some documents
        collection.find({USN:"1BM17CS005"}).toArray(function(err, docs) {
          assert.equal(err, null);
          console.log("Found the following records");
          console.log(docs);
          callback(docs);
        });
      
  }