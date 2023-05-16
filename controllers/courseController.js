const { Course } = require('../models/courses')
const { Chapter } = require('../models/chapters')
const { Lesson } = require('../models/lessons')
const { PreClassInquiry } = require('../models/pre_class_inquiries')
const { PreClassInquiryRes } = require('../models/pre_class_inquiries_responses')
const { ClassFaq } = require('../models/class_faqs')
const { ClassFaqQuestion } = require('../models/class_faq_questions')
const { RatingSummary } = require('../models/rating_summarys')
const { RatingPersonal } = require('../models/rating_personals')
const { errorTemplateFun } = require('../src/utils/template')

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
          ratings: ratingSummary.rating_personals ? ratingSummary.rating_personals : []
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
