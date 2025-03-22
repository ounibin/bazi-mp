import dayjs from 'dayjs'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendarTypeList: ['农历', '阳历'],
    calendarType: '农历',
    selectedDate: '1992-12-01',
    chineseHours: [
      '子时 (23:00-1:00)',
      '丑时 (1:00-3:00)',
      '寅时 (3:00-5:00)',
      '卯时 (5:00-7:00)',
      '辰时 (7:00-9:00)',
      '巳时 (9:00-11:00)',
      '午时 (11:00-13:00)',
      '未时 (13:00-15:00)',
      '申时 (15:00-17:00)',
      '酉时 (17:00-19:00)',
      '戌时 (19:00-21:00)',
      '亥时 (21:00-23:00)'
    ],
    chineseHour: '辰时 (7:00-9:00)'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) { },

  onChangeCalendarType(e) {
    const i = +e.detail.value
    const type = this.data.calendarTypeList[i]
    this.setData({
      calendarType: type
    })
  },

  onChangeBirth(e) {
    const date = e.detail.value
    this.setData({
      selectedDate: date
    })
  },

  onChangeChineseHours(e) {
    const i = +e.detail.value
    const hour = this.data.chineseHours[i]

    this.setData({
      chineseHour: hour
    })
  },

  queryBazi() {


    if (!(/^\d/.test(this.data.selectedDate))) {
      wx.showToast({
        title: '请输入生日时辰',
        icon: 'error',
        duration: 2000
      })
      return
    }

    wx.showLoading({
      title: '查询中...',
    })
    setTimeout(() => {
      wx.hideLoading()


      const { calendarType, selectedDate, chineseHour } = this.data
      wx.navigateTo({
        url: `/pages/result-detial/index?calendarType=${calendarType}&selectedDate=${selectedDate}&chineseHour=${chineseHour}`
      })

    }, 1000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '查看你的八字五行',
      path: '/pages/index/index'
    }
  }
})