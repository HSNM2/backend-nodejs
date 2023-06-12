const errorTemplateFun = (errMsg) => ({
  status: false,
  data: {
    errorMessage: errMsg
  }
})

const checkUserExist = (user) => {
  if (!user) {
    return res.status(404).json({
      status: false,
      message: '查無此使用者'
    })
  }
}

const checkCourseExist = (course) => {
  if (!course) {
    return res.status(404).json({
      status: false,
      message: '查無此課程'
    })
  }
}

const checkChapterExist = (user) => {
  if (!user) {
    return res.status(404).json({
      status: false,
      message: '查無此章節'
    })
  }
}

module.exports = {
  errorTemplateFun,
  checkUserExist,
  checkCourseExist,
  checkChapterExist
}
