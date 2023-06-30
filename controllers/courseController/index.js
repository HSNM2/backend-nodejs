const { User } = require('models/users')
const { Course } = require('models/courses')
const { Chapter } = require('models/chapters')
const { Lesson } = require('models/lessons')
const { PreClassInquiry } = require('models/pre_class_inquiries')
const { PreClassInquiryRes } = require('models/pre_class_inquiries_responses')
const { ClassFaq } = require('models/class_faqs')
const { ClassFaqQuestion } = require('models/class_faq_questions')
const { RatingSummary } = require('models/rating_summarys')
const { RatingPersonal } = require('models/rating_personals')
const { errorTemplateFun } = require('src/utils/template')
const { CONVERT } = require('src/utils/format')
const {
  URL_PREFIX,
  COURSE_PROVIDER_COVER_PHOTO_FOLDER_PREFIX,
  USER_AVATAR_FOLDER_PREFIX,
  COURSE_PROVIDER_VIDEO_FOLDER_PREFIX
} = require('src/js/url')

exports.course = {
  get: async (req, res) => {
    try {
      const courseId = req.params.courseid

      const courseData = await Course.findOne({
        where: { id: courseId }
      })
      if (!courseData) {
        return res.status(404).json({ message: '課程不存在' })
      }

      const responseData = {
        course: {
          ...courseData.dataValues,
          image_path: courseData.image_path
            ? `${URL_PREFIX}/${COURSE_PROVIDER_COVER_PHOTO_FOLDER_PREFIX}/${courseData.image_path}`
            : null
        }
      }

      res.json({
        status: true,
        message: '取完課程成功',
        data: responseData
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}

exports.courseChapter = {
  get: async (req, res) => {
    try {
      const courseId = req.params.courseid

      const courseData = await Course.findOne({
        where: { id: courseId }
      })
      if (!courseData) {
        return res.status(404).json({ message: '課程不存在' })
      }

      // 取得該課程的章節資訊
      const chapters = await Chapter.findAll({
        where: { courseId },
        attributes: ['id', 'title'],
        include: [
          {
            model: Lesson,
            attributes: ['id', 'title', 'videoPath'],
            where: { isPublish: true }
          }
        ]
      })

      const responseData = {
        chapters: chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            videoPath:
              process.env.NODE_ENV === 'development'
                ? `http://localhost:${process.env.PORT || 3002}/static/video/${lesson.videoPath}`
                : `https://${process.env.CLOUDFRONT_AVATAR_BUCKET_URL}/${COURSE_PROVIDER_VIDEO_FOLDER_PREFIX}/${lesson.videoPath}`
          }))
        }))
      }

      res.json({
        status: 200,
        chapters: responseData.chapters
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}

exports.courseInquiry = {
  get: async (req, res) => {
    try {
      const courseId = req.params.courseid

      const courseData = await Course.findOne({
        where: { id: courseId }
      })
      if (!courseData) {
        return res.status(404).json({ message: '課程不存在' })
      }

      //取得課前提問
      const classInquiryData = await PreClassInquiry.findAll({
        where: { courseId },
        attributes: ['id', 'name', 'createdAt', 'content'],
        include: [
          {
            model: PreClassInquiryRes,
            attributes: ['id', 'name', 'createdAt', 'content'],
            include: [
              {
                model: User,
                attributes: ['nickName', 'avatarImagePath']
              }
            ]
          },
          {
            model: User,
            attributes: ['nickName', 'avatarImagePath']
          }
        ]
      })
      classInquiryData.sort((a, b) => a.id - b.id)

      const responseData = {
        inquiries: classInquiryData.map((inquiry) => ({
          id: inquiry.id,
          name: inquiry.name,
          nickName: inquiry.user.nickName || '',
          imagePath:
            process.env.NODE_ENV === 'development'
              ? `http://localhost:${process.env.PORT || 3002}/static/avatar/${
                  inquiry.user.avatarImagePath
                }`
              : `https://${process.env.CLOUDFRONT_AVATAR_BUCKET_URL}/${USER_AVATAR_FOLDER_PREFIX}/${inquiry.user.avatarImagePath}`,
          date: CONVERT.formatDate(inquiry.createdAt),
          content: inquiry.content,
          responses: inquiry.pre_class_inquiries_responses.map((inquiryRes) => ({
            id: inquiryRes.id,
            name: inquiryRes.name,
            nickName: inquiryRes.user.nickName || '',
            imagePath:
              process.env.NODE_ENV === 'development'
                ? `http://localhost:${process.env.PORT || 3002}/static/avatar/${
                    inquiryRes.user.avatarImagePath
                  }`
                : `https://${process.env.CLOUDFRONT_AVATAR_BUCKET_URL}/${USER_AVATAR_FOLDER_PREFIX}/${inquiryRes.user.avatarImagePath}`,
            date: CONVERT.formatDate(inquiryRes.createdAt),
            content: inquiryRes.content
          }))
        }))
      }

      res.json({
        status: 200,
        inquiries: responseData.inquiries
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}

exports.courseFaq = {
  get: async (req, res) => {
    try {
      const courseId = req.params.courseid

      const courseData = await Course.findOne({
        where: { id: courseId }
      })
      if (!courseData) {
        return res.status(404).json({ message: '課程不存在' })
      }

      // 取得常見問題
      const classFaqData = await ClassFaq.findAll({
        where: { courseId },
        attributes: ['id', 'title'],
        include: [
          {
            model: ClassFaqQuestion,
            attributes: ['id', 'title', 'content', 'publish']
          }
        ]
      })

      const responseData = {
        faqs: classFaqData.map((faq) => ({
          id: faq.id,
          title: faq.title,
          questions: faq.class_faq_questions.map((question) => ({
            id: question.id,
            title: question.title,
            content: question.content,
            publish: question.publish
          }))
        }))
      }

      res.json({
        status: 200,
        faqs: responseData.faqs
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}

exports.courseRating = {
  get: async (req, res) => {
    try {
      const courseId = req.params.courseid

      const courseData = await Course.findOne({
        where: { id: courseId }
      })
      if (!courseData) {
        return res.status(404).json({ message: '課程不存在' })
      }

      // 取得課程評價平均分數
      const ratingSummary = await RatingSummary.findOne({
        where: { courseId },
        attributes: ['avgRating', 'countRating'],
        include: [
          {
            model: RatingPersonal,
            attributes: ['score', 'createdAt', 'content'],
            include: [
              {
                model: User,
                attributes: ['name', 'nickName', 'avatarImagePath']
              }
            ]
          }
        ]
      })

      const responseData = {
        rating: {
          avgRating: ratingSummary ? ratingSummary.avgRating : 0,
          countRating: ratingSummary ? ratingSummary.countRating : 0,
          ratings: ratingSummary
            ? ratingSummary.rating_personals.map((rating) => ({
                name: rating.user.name,
                score: rating.score,
                nickName: rating.user.nickName || '',
                imagePath:
                  process.env.NODE_ENV === 'development'
                    ? `http://localhost:${process.env.PORT || 3002}/static/avatar/${
                        rating.user.avatarImagePath
                      }`
                    : `https://${process.env.CLOUDFRONT_AVATAR_BUCKET_URL}/${USER_AVATAR_FOLDER_PREFIX}/${rating.user.avatarImagePath}`,
                date: CONVERT.formatDate(rating.createdAt),
                content: rating.content || ''
              }))
            : [],
          star1Count: ratingSummary
            ? ratingSummary.rating_personals.filter((rating) => parseInt(rating.score) === 1).length
            : 0,
          star2Count: ratingSummary
            ? ratingSummary.rating_personals.filter((rating) => parseInt(rating.score) === 2).length
            : 0,
          star3Count: ratingSummary
            ? ratingSummary.rating_personals.filter((rating) => parseInt(rating.score) === 3).length
            : 0,
          star4Count: ratingSummary
            ? ratingSummary.rating_personals.filter((rating) => parseInt(rating.score) === 4).length
            : 0,
          star5Count: ratingSummary
            ? ratingSummary.rating_personals.filter((rating) => parseInt(rating.score) === 5).length
            : 0
        }
      }

      res.json({
        status: 200,
        rating: responseData.rating
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}

exports.inquiryAsk = {
  post: async (req, res) => {
    try {
      const courseId = req.params.courseid
      const { content } = req.body
      const { userId } = req

      const user = await User.findOne({
        where: { id: userId },
        attributes: ['name']
      })

      if (!user) {
        return res.status(404).json({ message: '請先登入，如有其他問題請聯絡客服。' })
      }

      await PreClassInquiry.create({
        courseId: courseId,
        userId: userId,
        content: content,
        name: user.name
      })

      res.json({
        status: true,
        message: '提問成功'
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}

exports.inquiryAnswer = {
  post: async (req, res) => {
    const inquiryId = req.params.inquiryid
    const { content } = req.body
    const { userId } = req

    const user = await User.findOne({
      where: { id: userId },
      attributes: ['name']
    })

    if (!user) {
      return res.status(404).json({ message: '請先登入，如有其他問題請聯絡客服。' })
    }

    await PreClassInquiryRes.create({
      inquiriesId: inquiryId,
      userId: userId,
      content: content,
      name: user.name
    })
    res.json({
      status: true,
      message: '回覆成功'
    })
    try {
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}
