const AWS = require('aws-sdk');


AWS.config.update({
    accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY
});

var spacesEndpoint = new AWS.Endpoint(process.env.AWS_ENDPOINT);
var s3 = new AWS.S3({ endpoint: spacesEndpoint });

async function uploadToS3(filename, contentType, contents) {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `agile/${filename}`,
        Body: contents,
        ACL: 'public-read',
        ContentType: contentType
    };
    const response = await s3.upload(params).promise()
    return response
}

module.exports = {
    uploadToS3:uploadToS3
}