// dependencies
const AWS = require("aws-sdk");
require("dotenv").config();

const sesClientConfig = {
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

AWS.config.update(sesClientConfig);
const emailClient = new AWS.SES({ apiVersion: "2010-12-01" });

const sendEmailToUser = async (receiverEmail) => {
  const emailSubject = "Email From AWS SES";
  const emailBody = `
      <div>
      <p>Hi,</p>
      <p>Congratulations!</p>
      <p>Regards,</p>
      <p>Email Sender Info</p>
      </div>
      `;

  const params = {
    Destination: {
      ToAddresses: [`${receiverEmail}`], // this can multiple, check documentations on how to add cc & bcc
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: emailBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: emailSubject,
      },
    },
    Source: `${process.env.SENDER_EMAIL}`,
    ReplyToAddresses: [`${process.env.REPLYTO_EMAIL}`],
  };
  try {
    const sesResponse = await emailClient.sendEmail(params).promise();
    return { response: "success", sesResponse: sesResponse };
  } catch (error) {
    throw {
      message: "Something went wrong with AWS SES.",
      error: error,
    };
  }
};
