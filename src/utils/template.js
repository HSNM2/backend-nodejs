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

module.exports = {
  errorTemplateFun,
  checkUserExist
}
