'use strict';var AWS = require('aws-sdk'),
    transcoder = new AWS.ElasticTranscoder({
        apiVersion: '2012-09-25',
        region: 'ap-south-1'
    });

var s3 = new AWS.S3();
// use this in lambda console
exports.handler = (event, context, callback) => {
    let fileName = event.Records[0].s3.object.key;
    var srcKey =  decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    var newKey = fileName.split('.')[0];
    console.log('New video has been uploaded:', fileName);
transcoder.createJob({
     PipelineId: process.env.PIPELINE_ID, //create a pipeline in elastic transcoder
     Input: {
      Key: srcKey,
      FrameRate: 'auto',
      Resolution: 'auto',
      AspectRatio: 'auto',
      Interlaced: 'auto',
      Container: 'auto'
     },
     Output: {
      Key: getOutputName(fileName),
      ThumbnailPattern: '',
      PresetId: '1351620000001-200050',
      Rotate: 'auto'
     }
    }, function(err, data){
        if(err){
            console.log('Something went wrong:',err)
        }else{
            console.log('Converting is done');
            //console.log(event.Records[0].s3.bucket.name )
        }
     callback(err, data);
    });
    s3.putObject({
                    Bucket:	"outputbucketname" ,
                    Key: getOutputName(fileName)
                })
};
//This is just a test where some is being transcoded to .ts format
function getOutputName(srcKey){
 let withOutExtension = removeExtension(srcKey);
 return withOutExtension + '.ts';
}
function removeExtension(srcKey){
    let lastDotPosition = srcKey.lastIndexOf(".");
    if (lastDotPosition === -1) return srcKey;
    else return srcKey.substr(0, lastDotPosition);
}

