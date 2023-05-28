const { ClassFaq } = require('models/class_faqs')
const { ClassFaqQuestion } = require('models/class_faq_questions')

module.exports = {
  get: async (req, res) => {
    try {
      const { questionid } = res.params

      const question = await ClassFaqQuestion.findByPk(questionid, {
        attributes: ['id', 'title', 'content', 'publish']
      })

      if (question) {
        return res.json({
          success: true,
          data: question
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  post: async (req, res) => {
    try {
      const { faqid } = req.params
      const { title, content } = req.body
      const faq = await ClassFaq.findByPk(faqid)

      const result = await faq.createClass_faq_question({
        title,
        content
      })

      if (result) {
        return res.json({
          success: true,
          message: '新增問題內容成功'
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  patch: async (req, res) => {
    try {
      const { questionid } = req.params
      const { title, content } = req.body

      const result = await ClassFaqQuestion.update(
        {
          title,
          content
        },
        {
          where: {
            id: questionid
          }
        }
      )

      if (result) {
        return res.json({
          success: true,
          message: '修改問題內容成功'
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  delete: async (req, res) => {
    try {
      const { questionid } = req.params

      const result = await ClassFaqQuestion.destroy({
        where: { id: questionid }
      })

      if (result) {
        return res.json({
          success: true,
          message: '刪除問題內容成功'
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  inStack: async (req, res) => {
    try {
      const { questionid } = req.params

      const question = await ClassFaqQuestion.findByPk(questionid)

      const result = await question.update({
        publish: true
      })

      if (result) {
        return res.json({
          success: true,
          message: '上架問題內容成功'
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  offStack: async (req, res) => {
    try {
      const { questionid } = req.params

      const question = await ClassFaqQuestion.findByPk(questionid)

      const result = await question.update({
        publish: false
      })

      if (result) {
        return res.json({
          success: true,
          message: '下架問題內容成功'
        })
      }
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}
