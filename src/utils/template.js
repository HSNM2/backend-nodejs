const errorTemplateFun = (errMsg) => ({
  status: false,
  data: {
    errorMessage: errMsg
  }
})

module.exports = {
  errorTemplateFun
}
