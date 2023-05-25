const { Course } = require('models/courses')

const { errorTemplateFun } = require('src/utils/template')

exports.cartList = {
  get: async (req, res) => {
    try {
      const courseIds = req.body.id

      const intCourseIds = courseIds.map((id) => parseInt(id)).filter((id) => !isNaN(id))

      if (!Array.isArray(intCourseIds)) {
        return res.json({
          status: 400,
          message: '課程ID無效'
        })
      }

      if (intCourseIds.length === 0) {
        return res.json({
          status: 200,
          message: '您的購物車是空的，前往探索吧！'
        })
      }

      const cartData = []
      const invalidCourseIds = []
      for (const courseId of intCourseIds) {
        const cart = await Course.findByPk(courseId, {
          attributes: [
            'id',
            'title',
            'price',
            'originPrice',
            'link',
            'image_path',
            'type',
            'provider'
          ]
        })
        if (!cart) {
          invalidCourseIds.push(courseId)
        } else {
          cartData.push(cart)
        }
      }

      if (invalidCourseIds.length > 0) {
        return res.json({
          status: 400,
          message: '課程ID無效'
        })
      }

      let totalPrice = 0
      cartData.forEach((course) => {
        if (course.price < course.originPrice) {
          totalPrice += course.price
        } else {
          totalPrice += course.originPrice
        }
      })

      res.json({
        status: 200,
        message: '趕快下單吧',
        data: cartData,
        totalPrice: totalPrice
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}
