import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

// import { ManagedUpload } from '@aws-sdk/lib-storage';
// import { Readable } from 'stream';

import dotenv from 'dotenv';
import moment from './moment.js';

dotenv.config();

const albumBucketName = process.env.AWS_S3_BUCKET_NAME;
const bucketRegion = process.env.AWS_S3_REGION;


const client = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS,
        secretAccessKey: process.env.AWS_SECRET,
    }
});

const s3Upload = async (file) => {
    const dir = moment().format('YYYY/MM/DD/HH');
    const fileName = Math.random().toString(36).substring(2, 12) + `.${file.mimetype.split('/')[1]}`;
    const photoKey = dir + '/' + fileName;

    const command = new PutObjectCommand({
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file.buffer,
    });
    

    try {
        const response = await client.send(command);
        return process.env.CLOUDFRONT_DOMAIN + '/' + photoKey;
    } catch (error) {
        console.error("There was an error uploading your photo: ", error);
        return false;
    }
};

const s3Delete = async (photoKey) => {
    const command = new DeleteObjectCommand({
        Bucket: albumBucketName,
        Key: photoKey,
    });

    try {
        const response = await client.send(command);
        console.log(response);
        return true;
    } catch (error) {
        console.error("There was an error deleting your photo: ", error);
        return false;
    }
};

const emptyS3Directory = async (dir) => {
    const listParams = new ListObjectsV2Command({
        Bucket: albumBucketName,
        Prefix: dir,
    });

    const listedObjects = await s3Client.send(listParams);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

    const deleteParams = new DeleteObjectsCommand({
        Bucket: albumBucketName,
        Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key })) },
    });

    try {
        const result = await s3Client.send(deleteParams);
        console.log(result);
    } catch (error) {
        console.error("There was an error deleting objects from your directory: ", error);
    }
};

export { s3Upload as uploadFile, s3Delete as deleteFile, emptyS3Directory };
