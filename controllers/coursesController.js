const { Course } = require('../models/courses')
const { errorTemplateFun } = require('../src/utils/template')

// 取得課程列表
exports.courses = {
  get: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query

      const offset = (page - 1) * limit

      const { count, rows } = await Course.findAndCountAll({
        attributes: [
          'id',
          'name',
          'image_path',
          'price',
          'originPrice',
          'link',
          'teacher',
          'tag',
          'buyers',
          'totalTime',
          [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating'],
          [Sequelize.fn('COUNT', Sequelize.col('rating')), 'ratingCount']
        ],
        limit,
        offset
      })

      const courses = rows.map((course) => {
        return {
          id: course.id,
          name: course.name,
          image_path: course.image_path,
          rating: {
            average: course.getDataValue('avgRating'), // 取得計算的平均評分
            count: course.getDataValue('ratingCount') // 取得評分人數
          },
          price: course.price,
          originPrice: course.originPrice,
          link: course.link,
          teacher: course.teacher,
          tag: course.tag,
          buyers: course.buyers,
          totalTime: course.totalTime
        }
      })

      res.json({
        success: true,
        data: courses,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(count / limit),
          totalCourses: count
        }
      })
    } catch (error) {
      console.error(error)
      res.status(500).send(errorTemplateFun(error))
    }
  }
}
