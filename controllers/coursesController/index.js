const { Course } = require('models/courses')
const { RatingSummary } = require('models/rating_summarys')
const { errorTemplateFun } = require('src/utils/template')

// 取得課程列表
exports.courses = {
  get: async (req, res) => {
    try {
      const page = req.query.page || 1
      const limit = req.query.limit || 20
      const offset = (page - 1) * limit

      const courseData = await Course.findAndCountAll({
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
        ],
        order: [['createdAt', 'DESC']], // 根據 createdAt 欄位降冪排序
        limit,
        offset
      })

      const courses = courseData.rows.map((course) => {
        return {
          id: course.id,
          title: course.title,
          subTittle: course.subTitle,
          image_path: course.image_path,
          price: course.price,
          originPrice: course.originPrice,
          link: course.link,
          provider: course.provider,
          tag: course.tag,
          buyers: course.buyers ? course.buyers.length : 0,
          totalTime: course.totalTime ? course.totalTime : 0,
          courseStatus: course.courseStatus,
          type: course.type,
          category: course.category,
          rating: {
            avgRating: course.rating_summary ? course.rating_summary.avgRating : 0,
            countRating: course.rating_summary ? course.rating_summary.countRating : 0
          }
        }
      })

      res.json({
        success: true,
        data: courses,
        page,
        totalPages: Math.ceil(courseData.count / limit)
      })
    } catch (error) {
      console.error(error)
      res.status(500).send(errorTemplateFun(error))
    }
  }
}
