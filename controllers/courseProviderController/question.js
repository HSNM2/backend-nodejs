module.exports = {
  get: async (req, res) => {
    try {
      return res.json({
        success: true,
        message: '獲取問題內容'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  post: async (req, res) => {
    try {
      return res.json({
        success: true,
        message: '新增問題內容'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  patch: async (req, res) => {
    try {
      return res.json({
        success: true,
        message: '修改問題內容'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  delete: async (req, res) => {
    try {
      return res.json({
        success: true,
        message: '刪除問題內容'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  inStack: async (req, res) => {
    try {
      return res.json({
        success: true,
        message: '上架問題內容'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  },
  offStack: async (req, res) => {
    try {
      return res.json({
        success: true,
        message: '下架問題內容'
      })
    } catch (error) {
      console.error(error)
      res.json(errorTemplateFun(error))
    }
  }
}
