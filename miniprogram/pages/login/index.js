// const WXAPI = require('apifm-wxapi')
// const AUTH = require('../../utils/auth')
Page({
  data: {
    checked: false
  },
  onLoad(options) {
  },
  onShow() {

  },
  xieyiChange(e) {
    this.setData({
      checked: e.detail,
    })
  },
  goxieyi(e) {
    wx.showToast({
      title: '用户协议和隐私协议暂未开放',
      icon: 'none',
      image: '',
      duration: 1500,
      mask: false,
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
    // wx.navigateTo({
    //   url: '/pages/about/index?key=' + e.currentTarget.dataset.key,
    // })
  },
  showModal2() {
    wx.showModal({
      title: '温馨提示',
      content: '已经阅读并同意《用户协议》、《隐私协议》',
      cancelText: '不同意',
      confirmText: '同意',
      success: res => {
        if (res.confirm) {
          this.setData({
            checked: true
          })
        }
      }
    })
  },
  showModal(action) {
    wx.showModal({
      title: '温馨提示',
      content: '已经阅读并同意《用户协议》、《隐私协议》',
      cancelText: '不同意',
      confirmText: '同意',
      success: res => {
        if (res.confirm) {
          this.setData({
            checked: true
          })
          if (action == 'loginOne') {
            this.loginOne()
          }
        }
      }
    })
  },
  async loginOne() {
    if (!this.data.checked) {
      this.showModal('loginOne')
      return
    }
    // const res = await AUTH.login20241025()
    // if (res.code == 10000) {
    //   // 用户不存在
    //   wx.showModal({
    //     content: '您还未注册，请使用《手机号安全登陆》方式登陆',
    //     showCancel: false
    //   })
    //   return
    // }
    // if (res.code != 0) {
    //   // 登录错误
    //   return
    // }
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  async getPhoneNumber(e) {
    if (e.detail.errMsg.indexOf('privacy permission is not authorized') != -1) {
      wx.showModal({
        content: '请阅读并同意隐私条款以后才能继续本操作',
        confirmText: '阅读协议',
        cancelText: '取消',
        success (res) {
          if (res.confirm) {
            wx.requirePrivacyAuthorize() // 弹出用户隐私授权框
          }
        }
      })
      return
    }
    if (!e.detail.errMsg) {
      wx.showModal({
        content: 'getPhoneNumber异常',
        showCancel: false
      })
      return
    }
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
      return
    }
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        content: e.detail.errMsg,
        showCancel: false
      })
      return;
    }
    this._getPhoneNumber(e)
  },
  async _getPhoneNumber(e) {
    console.log(`异步打印----获取手机号: `, e)
    const { code } = await wx.login()
    const { encryptedData, iv } = e
    
    wx.cloud.callFunction({
      name: 'register',
      data: {
        type: 'phone',
        code,          // 微信登录code
        encryptedData,  // 加密的手机号数据
        iv
      }
    }).then(res => {
      console.log('注册/登录成功', res)
      wx.reLaunch({
        url: '/pages/my/index',
      })
    })
  },
})