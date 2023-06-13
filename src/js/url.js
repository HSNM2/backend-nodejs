exports.USER_AVATAR_FOLDER_PREFIX = 'avatar'
exports.COURSE_PROVIDER_VIDEO_FOLDER_PREFIX = 'video'
exports.COURSE_PROVIDER_COVER_PHOTO_FOLDER_PREFIX = 'coverPhoto'

exports.URL_PREFIX =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${process.env.PORT || 3002}/static`
    : `https://${process.env.CLOUDFRONT_AVATAR_BUCKET_URL}`
