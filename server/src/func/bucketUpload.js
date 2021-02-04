/*
AWS S3 bucket functions 
*/
const AWS = require('aws-sdk');

// Sets the keys used to access the bucket
AWS.config.update({
    accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY
});
// Set the endpoint used for AWS S3
var spacesEndpoint = new AWS.Endpoint(process.env.AWS_ENDPOINT);
var s3 = new AWS.S3({ endpoint: spacesEndpoint });

/**
 * Upload a file to S3 Bucket
 * @param {string} filename - name of the file
 * @param {string} contentType - type of file being uploaded
 * @param {*} contents - content of the file
 */
async function uploadToS3(filename, contentType, contents) {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `agile/${filename}`,
        Body: contents,
        ACL: 'private',
        ContentType: contentType
    };
    const response = await s3.upload(params).promise()
    return response
}

/**
 * Get a signedURL for a file 
 * @param {number} validTime - time URL should be valid for in Minutes
 * @param {String} fileKey 
 * @returns {String} - URL 
 */
async function getSignedURL(validTime, fileKey){
    const signedUrlExpireSeconds = 60 * validTime

    const url = await s3.getSignedUrl('getObject', {
        Bucket: process.env.BUCKET_NAME,
        Key: fileKey,
        Expires: signedUrlExpireSeconds
    });

    return url
}

module.exports = {
    uploadToS3:uploadToS3,
    getSignedURL:getSignedURL
}