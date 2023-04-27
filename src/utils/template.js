const errorTemplateFun = (errMsg) => ({
  success: false,
  data: {
    errorMessage: errMsg
  }
})

module.exports = {
  errorTemplateFun
}
