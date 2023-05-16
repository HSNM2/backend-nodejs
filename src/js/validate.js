const identityValidate = (identity) => {
  return (checkIdentity) => {
    return checkIdentity === identity
  }
}

module.exports = {
  identityValidate
}
