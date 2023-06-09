const { Course } = require('models/courses')
const { Order } = require('models/orders')
const { OrderDetail } = require('models/order_details')
const { User } = require('models/users')
const {
  genDataChain,
  create_mpg_aes_encrypt,
  create_mpg_sha_encrypt,
  create_mpg_aes_decrypt
} = require('src/utils/crypt')
const { getCourseData } = require('./cartOperations')
const { calculateTotalPrice } = require('src/utils/calculate')
const { errorTemplateFun } = require('src/utils/template')

exports.cartList = {
  post: async (req, res) => {
    try {
      const courseIds = req.body.id

      const attributes = [
        'id',
        'title',
        'price',
        'originPrice',
        'link',
        'image_path',
        'type',
        'provider'
      ]

      const { status, message, courseData } = await getCourseData(courseIds, attributes)

      if (status === 400) {
        return res.json({
          status,
          message
        })
      }

      const totalPrice = calculateTotalPrice(courseData)

      res.json({
        status: 200,
        message: '趕快下單吧',
        data: courseData,
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
      const courseIds = req.body.id
      const { email, name } = req.body

      const attributes = ['id', 'title', 'price', 'originPrice']

      const { status, message, courseData } = await getCourseData(courseIds, attributes)

      if (status === 400) {
        return res.json({
          status,
          message
        })
      }

      // 商品詳細，限制50字元
      const itemDesc = courseData.map((course) => course.title)
      const mergedDesc = itemDesc.join(', ')
      const limitedDesc = mergedDesc.substring(0, 50)

      const totalPrice = calculateTotalPrice(courseData)

      if (email === '' || name === '') {
        return res.json({
          status: 400,
          message: '請填妥表單'
        })
      }

      const timeStamp = Math.round(new Date().getTime() / 1000)
      const randomNum = Math.floor(Math.random() * 90000) + 10000
      const orderNumber = `${timeStamp}${randomNum}`
      const order = {
        Email: email,
        Name: name,
        Amt: totalPrice,
        ItemDesc: limitedDesc,
        TimeStamp: timeStamp,
        MerchantOrderNo: orderNumber
      }

      // 保留測試用
      // const paramString = genDataChain(order)
      // console.log('paramString:', paramString)

      // 加密第一段字串，此段主要是提供交易內容給予藍新金流
      const aesEncrypt = create_mpg_aes_encrypt(order)
      // console.log('aesEncrypt:', aesEncrypt)

      // 使用 HASH 再次 SHA 加密字串，作為驗證使用
      const shaEncrypt = create_mpg_sha_encrypt(aesEncrypt)
      // console.log('shaEncrypt:', shaEncrypt)

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
      const { userId } = req
      const { email, name, merchantOrderNo } = req.body
      const courseIds = req.body.id
      const discount = req.body.discount || 0

      const attributes = ['id', 'price', 'originPrice']

      const { status, message, courseData } = await getCourseData(courseIds, attributes)

      if (status === 400) {
        return res.json({
          status,
          message
        })
      }

      if (email === '' || name === '' || merchantOrderNo === '') {
        return res.json({
          status: 400,
          message: '請填妥表單'
        })
      }

      const totalPrice = calculateTotalPrice(courseData)
      const createdOrder = await Order.create({
        email,
        name,
        merchantOrderNo,
        amt: totalPrice,
        isPurchased: false,
        userId
      })

      for (const item of courseData) {
        const course = await Course.findByPk(item.id)

        if (course) {
          await OrderDetail.create({
            orderId: createdOrder.id,
            courseId: course.id,
            originalPrice: course.price ? course.price : course.originPrice,
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
      const response = req.body

      const thisShaEncrypt = create_mpg_sha_encrypt(response.TradeInfo)
      // 使用 HASH 再次 SHA 加密字串，確保比對一致（確保不正確的請求觸發交易成功）
      if (!thisShaEncrypt === response.TradeSha) {
        console.log('付款失敗：TradeSha 不一致')
        return res.end()
      }

      // 解密交易內容
      const data = create_mpg_aes_decrypt(response.TradeInfo)

      // 取得交易內容，並查詢本地端資料庫是否有相符的訂單
      const order = await Order.findOne({
        where: {
          merchantOrderNo: data.Result.MerchantOrderNo
        },
        include: OrderDetail
      })

      if (order) {
        order.isPurchased = true
        order.paymentType = data.Result.PaymentType
        order.payTime = data.Result.PayTime
        await order.save()

        const user = await User.findByPk(order.userId)

        if (user) {
          for (const orderDetail of order.order_details) {
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
