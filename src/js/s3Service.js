const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const uuid = require('uuid').v4

exports.s3Uploadv3 = async (file, folderName) => {
  const s3Client = new S3Client()
  const fileName = `${uuid()}-${file.originalname}`

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folderName}/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype
  }

  try {
    const response = await s3Client.send(new PutObjectCommand(param))

    if (response) {
      return {
        ...response,
        fileName
      }
    }
  } catch (error) {
    return error
  }
}

exports.s3Delete3 = async (folderName, fileName) => {
  const s3Client = new S3Client()

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folderName}/${fileName}`
  }

  try {
    const response = await s3Client.send(new DeleteObjectCommand(param))

    if (response) {
      return response
    }
  } catch (error) {
    return error
  }
}
