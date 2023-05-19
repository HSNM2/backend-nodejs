const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const uuid = require('uuid').v4

exports.s3Uploadv3 = async (file) => {
  const s3Client = new S3Client()

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `avatar/${uuid()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype
  }

  try {
    const response = await s3Client.send(new PutObjectCommand(param))

    if (response) {
      const bucketUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/`
      const fileUrl = `${bucketUrl}${param.Key}`
      return {
        ...response,
        pictureUrl: fileUrl
      }
    }
  } catch (error) {
    return error
  }
}
