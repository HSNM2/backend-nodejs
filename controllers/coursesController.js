const { Course } = require('../models/courses')
const { RatingSummary } = require('../models/rating_summarys')
const { errorTemplateFun } = require('../src/utils/template')

// 取得課程列表
exports.courses = {
  get: async (req, res) => {
    try {
      const courseData = await Course.findAll({
        where: { isPublish: true },
        attributes: [
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
        ],
        include: [
          {
            model: RatingSummary,
            attributes: ['avgRating', 'countRating']
          }
        ]
      })

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
          }
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
