import Dialog from '@vant/weapp/dialog/dialog'


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

    // if (!wx.getStorageSync('userId')) {
    //   wx.showToast({
    //     title: '请先登录',
    //     duration: 2000
    //   })
    //   setTimeout(() => {
    //     wx.navigateTo({
    //       url: '/pages/login/index'
    //     })
    //   }, 2000);
    //   return
    // }

    wx.showLoading({
      title: '查询中...',
    })
    const leftTime = wx.getStorageSync('queryLeftTime')
    setTimeout(() => {
      wx.hideLoading()

      // 扣掉一次查询次数
      // console.log(`异步打印----typeof this.data.queryLeftTime: `, typeof this.data.queryLeftTime)
      // if (leftTime <= 0) {
      //   Dialog.alert({
      //     title: '可用次数不足',
      //     message: '点击右上角"..."，分享给好友可获得更多查询次数',
      //   })
      //   return
      // }




      // wx.setStorageSync('hasQueryList', data);

      const { calendarType, selectedDate, chineseHour } = this.data
      wx.setStorageSync('calendarType', calendarType)
      wx.setStorageSync('selectedDate', selectedDate)
      wx.setStorageSync('chineseHour', chineseHour)
      // ?calendarType=${calendarType}&selectedDate=${selectedDate}&chineseHour=${chineseHour}
      // wx.navigateTo({
      //   url: `/pages/index/index`
      // }).then(res => {
      //   // wx.setStorageSync('queryLeftTime', leftTime - 1)
      // })
      wx.navigateBack()


    }, 1000)
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
    console.log(`异步打印----onShareAppMessage: `,)
    const leftTime = wx.getStorageSync('queryLeftTime')
    wx.setStorageSync('queryLeftTime', leftTime + 1)

    return {
      title: '查看你的金木水火土属性',
      path: '/pages/index/index'
    }
  }
})