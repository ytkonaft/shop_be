const uuid = require("uuid/v1");
const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  params: {
    Bucket: process.env.S3_BUCKET
  }
});

exports.processUpload = async (upload, ctx) => {
  if (!upload) {
    return console.log("ERROR: No file received.");
  }

  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();

  const key = uuid() + "-" + filename;

  // Upload to S3
  const response = await s3
    .upload({
      Key: key,
      ACL: "public-read",
      Body: stream
    })
    .promise();

  return response.Location;
};
