//dependencies 
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// configs
const config = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
};

AWS.config.update(config);
s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const targetBucket = process.env.STORAGE_BUCKET;

// put an object to s3
const getS3Url = async (name) => {
  try {
    const salt = uuidv4(); // generate random id. This ensures uniqness.
    const fileNameWithFullPath = `folder1/folder2/${name}-${salt}`;
    const uploadParams = {
      Bucket: targetBucket,
      Key: "",
      Body: "",
      ACL: "public-read", // this allows the object to be publicly readable.
      // Remove ACL to make the data private.
    };

    uploadParams.Body = Buffer.from(encodedString, "base64");
    uploadParams.Key = fileNameWithFullPath;
    const s3response = await s3.upload(uploadParams).promise();

    return await s3response.Location; // returns the url
  } catch (error) {
    console.log("Error on saving data to S3 bucket", error);
    throw { message: "No url was generated due to an error" };
  }
};

// remove an object from s3 using existing s3 url
const removeS3Object = async (existingUrl) => {
  const config = {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.COVER_IMAGE_ACCESS_KEY,
    secretAccessKey: process.env.COVER_IMAGE_SECRET_KEY,
  };
  AWS.config.update(config);
  s3 = new AWS.S3({ apiVersion: "2006-03-01" });

  const objectPath = existingUrl.split("amazonaws.com/")[1];
  const removeParams = { Bucket: targetBucket, Key: objectPath };
  try {
    return await s3.deleteObject(removeParams).promise();
  } catch (error) {
    console.log("Error on deleting data from S3 bucket.");
    throw { message: "Something went wrong while deleting the data." };
  }
};

// list objects in s3 bucket
const listS3Contents = async () => {
  const bucketParams = {
    Bucket: targetBucket,
  };
  try {
    const data = await s3.listObjects(bucketParams).promise();
    console.log("S3 contents:", data);
  } catch (err) {
    console.log("Error:", err);
  }
};
