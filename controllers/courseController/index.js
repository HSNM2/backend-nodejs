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

      // 取得該課程的章節資訊
      const chapters = await Chapter.findAll({
        where: { courseId },
        attributes: ['id', 'title'],
        include: [
          {
            model: Lesson,
            attributes: ['id', 'title']
          }
        ]
      })

      //取得課前提問
      const classInquiryData = await PreClassInquiry.findAll({
        where: { courseId },
        attributes: ['id', 'name', 'date', 'content'],
        include: [
          {
            model: PreClassInquiryRes,
            attributes: ['id', 'name', 'date', 'content']
          }
        ]
      })
      classInquiryData.sort((a, b) => a.id - b.id)

      // 取得常見問題
      const classFaqData = await ClassFaq.findAll({
        where: { courseId },
        attributes: ['id', 'title', 'publish'],
        include: [
          {
            model: ClassFaqQuestion,
            attributes: ['id', 'content', 'publish']
          }
        ]
      })

      // 取得課程評價平均分數
      const ratingSummary = await RatingSummary.findOne({
        where: { courseId },
        attributes: ['avgRating', 'countRating'],
        include: [
          {
            model: RatingPersonal,
            attributes: ['name', 'number', 'date', 'content']
          }
        ]
      })

      const responseData = {
        course: courseData,
        chapters: chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title
          }))
        })),
        inquiries: classInquiryData.map((inquiry) => ({
          id: inquiry.id,
          name: inquiry.name,
          date: inquiry.date,
          content: inquiry.content,
          responses: inquiry.pre_class_inquiries_responses
        })),
        faqs: classFaqData.map((faq) => ({
          id: faq.id,
          title: faq.title,
          publish: faq.publish,
          questions: faq.class_faq_questions.map((question) => ({
            id: question.id,
            content: question.content,
            publish: question.publish
          }))
        })),
        rating: {
          avgRating: ratingSummary ? ratingSummary.avgRating : 0,
          countRating: ratingSummary ? ratingSummary.countRating : 0,
          ratings:
            ratingSummary && ratingSummary.rating_personals ? ratingSummary.rating_personals : []
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
