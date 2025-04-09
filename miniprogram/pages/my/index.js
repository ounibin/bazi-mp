// const WXAPI = require('apifm-wxapi')
// const AUTH = require('../../utils/auth')
// const CONFIG = require('../../config.js')
Page({
  data: {
    userId: '',
    queryLeftTime: '无限'
  },
  onLoad() {
    console.log(`异步打印----page my onLoad: `,)

  },
  onShow() {
    console.log(`异步打印----page my onShow: `,)
    const userId = wx.getStorageSync('userId')
    this.setData({
      userId,
    })
    if (!userId) {
      this.goLogin()
    }
  },

  goLogin() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },

  async loginByPhone() {

    const phoneNumber = '13800138000'
    const verificationCode = '1'
    try {
      // 调用云函数
      const res = await wx.cloud.callFunction({
        name: 'users',
        data: {
          action: 'register',
          data: {
            phone: phoneNumber,
            verificationCode: verificationCode,
          }
        }
      })
      console.log(`异步打印----res: `, res)
      // if (res.result.code === 200) {
      //   alert('注册成功！')
      // } else {
      //   alert(res.result.message)
      // }
    } catch (error) {
      console.error('注册失败:', error)
    }
  },
  async getUserApiInfo() {
    // const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    // if (res.code == 0) {
    //   let _data = {}
    //   _data.apiUserInfoMap = res.data
    //   if (res.data.base.mobile) {
    //     _data.userMobile = res.data.base.mobile
    //   }
    //   _data.nick = res.data.base.nick
    //   if (this.data.order_hx_uids && this.data.order_hx_uids.indexOf(res.data.base.id) != -1) {
    //     _data.canHX = true // 具有扫码核销的权限
    //   }
    //   if (res.data.peisongMember && res.data.peisongMember.status == 1) {
    //     _data.memberChecked = false
    //   } else {
    //     _data.memberChecked = true
    //   }
    //   this.setData(_data);
    // }
  },
  async memberCheckedChange() {
    // const res = await WXAPI.peisongMemberChangeWorkStatus(wx.getStorageSync('token'))
    // if (res.code != 0) {
    //   wx.showToast({
    //     title: res.msg,
    //     icon: 'none'
    //   })
    // } else {
    //   this.getUserApiInfo()
    // }
  },
  getUserAmount: function () {
    // var that = this;
    // WXAPI.userAmount(wx.getStorageSync('token')).then(function (res) {
    //   if (res.code == 0) {
    //     that.setData({
    //       balance: res.data.balance.toFixed(2),
    //       freeze: res.data.freeze.toFixed(2),
    //       score: res.data.score,
    //       growth: res.data.growth
    //     });
    //   }
    // })
  },
  handleOrderCount: function (count) {
    return count > 99 ? '99+' : count;
  },
  login() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
})