const CONVERT = require('./format').CONVERT

describe('測試 format function', () => {
  test('所有 input 都有加上!', () => {
    expect(CONVERT.stringAddSymbol('天氣好')).toBe('天氣好！')
  })
})
