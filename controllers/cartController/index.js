const { Course } = require('models/courses')
const { Order } = require('models/orders')
const { OrderDetail } = require('models/order_details')
const { User } = require('models/users')
const {
  genDataChain,
  create_mpg_aes_encrypt,
  create_mpg_sha_encrypt,
  create_mpg_aes_decrypt
} = require('./crypt')
const { errorTemplateFun } = require('src/utils/template')

exports.cartList = {
  post: async (req, res) => {
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

exports.order = {
  post: async (req, res) => {
    try {
      const { itemDesc, amt } = req.body
      const { email } = req
      const timeStamp = Math.round(new Date().getTime() / 1000)

      if (email === '' || amt === '' || itemDesc === '') {
        return res.json({
          status: 400,
          message: '請填妥表單'
        })
      }

      const randomNum = Math.floor(Math.random() * 90000) + 10000
      const orderNumber = `${timeStamp}${randomNum}`
      const order = {
        Email: email,
        Amt: amt,
        ItemDesc: itemDesc, // 請前端固定回傳 “糖漬時光線上課程”
        TimeStamp: timeStamp,
        MerchantOrderNo: orderNumber
      }

      // 保留測試用
      // const paramString = genDataChain(order)
      // console.log('paramString:', paramString)

      // 加密第一段字串，此段主要是提供交易內容給予藍新金流
      const aesEncrypt = create_mpg_aes_encrypt(order)
      console.log('aesEncrypt:', aesEncrypt)

      // 使用 HASH 再次 SHA 加密字串，作為驗證使用
      const shaEncrypt = create_mpg_sha_encrypt(aesEncrypt)
      console.log('shaEncrypt:', shaEncrypt)

      res.json({
        status: true,
        order,
        aesEncrypt,
        shaEncrypt
      })
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}

exports.createOrder = {
  post: async (req, res) => {
    try {
      const { userId, email } = req
      const { amt, orderNumber } = req.body
      const courseIds = req.body.id
      const discount = req.body.discount || 0

      const intCourseIds = courseIds.map((id) => parseInt(id)).filter((id) => !isNaN(id))

      if (!Array.isArray(intCourseIds)) {
        return res.json({
          status: 400,
          message: '課程ID無效'
        })
      }

      const createdOrder = await Order.create({
        email,
        merchantOrderNo: orderNumber,
        amt,
        isPurchased: false,
        userId
      })

      for (const courseId of intCourseIds) {
        const course = await Course.findByPk(courseId)

        if (course) {
          await OrderDetail.create({
            orderId: createdOrder.id,
            courseId: courseId,
            originalPrice: course.price,
            discount: discount
          })
        }
      }

      res.end()
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}

// 確認交易：Notify
exports.notify = {
  post: async (req, res) => {
    try {
      console.log('req.body notify data', req.body)
      const response = req.body

      const thisShaEncrypt = create_mpg_sha_encrypt(response.TradeInfo)
      // 使用 HASH 再次 SHA 加密字串，確保比對一致（確保不正確的請求觸發交易成功）
      if (!thisShaEncrypt === response.TradeSha) {
        console.log('付款失敗：TradeSha 不一致')
        return res.end()
      }

      // 解密交易內容
      const data = create_mpg_aes_decrypt(response.TradeInfo)
      // console.log('data:', data)

      // 取得交易內容，並查詢本地端資料庫是否有相符的訂單
      const order = await Order.findOne({
        where: {
          merchantOrderNo: data.MerchantOrderNo
        },
        include: OrderDetail
      })

      if (order) {
        order.isPurchased = true
        order.paymentType = data.PaymentType
        order.payTime = data.PayTime
        await order.save()

        const user = await User.findByPk(order.userId)

        if (user) {
          for (const orderDetail of order.OrderDetail) {
            const courseId = orderDetail.courseId
            await user.addCourse(courseId)
          }
        }

        return res.end()
      } else {
        res.json({
          status: false,
          message: '找不到對應的訂單'
        })
      }

      return res.end()
    } catch (error) {
      console.log(error)
      errorTemplateFun(error)
    }
  }
}
