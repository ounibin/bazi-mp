export const local = {
  set: (key, value) => {
    value = typeof value === 'string' ? value : JSON.stringify(value)
    return wx.setStorage(key, value)
  },
  get: (key) => {
    const value = wx.getStorageSync(key)
    try {
      return typeof value === 'string' ? value : JSON.parse(value)
    } catch (e) {
      return value
    }
  }
}