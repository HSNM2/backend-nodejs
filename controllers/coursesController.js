const { Course } = require('../models/courses')
const { User } = require('../models/users')
const { RatingSummary } = require('../models/rating_summarys')
const { errorTemplateFun } = require('../src/utils/template')

const { getTokenData } = require('../src/js/verifyToken')

// 取得課程列表
exports.courses = {
  get: async (req, res) => {
    try {
      const token = req.headers.authorization
      let userId = null
      if (token) {
        const decodedToken = await getTokenData(token.split(' ')[1])
        userId = decodedToken.id
      }

      const isMember = Boolean(userId)
      let courseData = null
      const attributes = [
        'id',
        'title',
        'subTitle',
        'image_path',
        'price',
        'originPrice',
        'link',
        'provider',
        'tag',
        'buyers',
        'totalTime',
        'courseStatus',
        'type',
        'category'
      ]
      if (isMember) {
        courseData = await Course.findAll({
          where: { isPublish: true },
          attributes: attributes,
          include: [
            {
              model: RatingSummary,
              attributes: ['avgRating', 'countRating']
            },
            {
              model: User,
              where: { id: userId },
              required: false
            }
          ]
        })
      } else {
        courseData = await Course.findAll({
          where: { isPublish: true },
          attributes: attributes,
          include: [
            {
              model: RatingSummary,
              attributes: ['avgRating', 'countRating']
            }
          ]
        })
      }

      const courses = courseData.map((course) => {
        return {
          id: course.id,
          title: course.title,
          subTittle: course.subtitle,
          image_path: course.image_path,
          price: course.price,
          originPrice: course.originPrice,
          link: course.link,
          provider: course.provider,
          tag: course.tag,
          buyers: course.buyers,
          totalTime: course.totalTime,
          courseStatus: course.courseStatus,
          type: course.type,
          category: course.category,
          rating: {
            avgRating: course.rating_summary.avgRating,
            countRating: course.rating_summary.countRating
          },
          favorite: (course.users && course.users.length > 0) || false
        }
      })

      res.json({
        success: true,
        data: courses
      })
    } catch (error) {
      console.error(error)
      res.status(500).send(errorTemplateFun(error))
    }
  }
}
