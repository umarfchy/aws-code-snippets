const AWS = require("aws-sdk");

const clientConfig = {
  region: process.env.AWS_REGION,
  endpoint: process.env.DDB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const ddb = new AWS.DynamoDB.DocumentClient(clientConfig);

const getData = async (id) => {
  try {
    const params = {
      TableName: process.env.COMPANY_USER_TABLE,
      Key: { id: id },
    };

    const data = await ddb.get(params).promise();
    return data.Item;
  } catch (err) {
    throw {
      message: "Error processing request. Please try again",
      err: err,
    };
  }
};
