const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const CONFIG = require('../../config.js')
Page({
	data: {
    balance:0.00,
    freeze:0,
    score:0,
    nick: undefined,
  },
	onLoad() {},
  onShow() {
    // 检查登录状态
    // AUTH.checkHasLogined().then(isLogined => {
    //   if (isLogined) {
    //     this.getUserApiInfo();
    //     this.getUserAmount();
    //     this.orderStatistics();
    //     this.cardMyList();
    //     TOOLS.showTabBarBadge();
    //   } else {
    //     getApp().loginOK = () => {
    //       this.getUserApiInfo();
    //       this.getUserAmount();
    //       this.orderStatistics();
    //       this.cardMyList();
    //       TOOLS.showTabBarBadge();
    //     }
    //   }
    // })
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
    const res = await WXAPI.peisongMemberChangeWorkStatus(wx.getStorageSync('token'))
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    } else {
      this.getUserApiInfo()
    }
  },
  getUserAmount: function () {
    var that = this;
    WXAPI.userAmount(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        that.setData({
          balance: res.data.balance.toFixed(2),
          freeze: res.data.freeze.toFixed(2),
          score: res.data.score,
          growth: res.data.growth
        });
      }
    })
  },
  handleOrderCount: function (count) {
    return count > 99 ? '99+' : count;
  },
  orderStatistics: function () {
    WXAPI.orderStatistics(wx.getStorageSync('token')).then((res) => {
      if (res.code == 0) {
        const {
          count_id_no_confirm,
          count_id_no_pay,
          count_id_no_reputation,
          count_id_no_transfer,
        } = res.data || {}
        this.setData({
          count_id_no_confirm: this.handleOrderCount(count_id_no_confirm),
          count_id_no_pay: this.handleOrderCount(count_id_no_pay),
          count_id_no_reputation: this.handleOrderCount(count_id_no_reputation),
          count_id_no_transfer: this.handleOrderCount(count_id_no_transfer),
        })
      }
    })
  },
  scanOrderCode(){
    wx.scanCode({
      success(res) {
        console.log('res', res);
        if (res.scanType == 'WX_CODE' && res.path) {
          wx.navigateTo({
            url: '/' + res.path,
          })
        } else {
          wx.navigateTo({
            url: '/pages/order-details/scan-result?hxNumber=' + res.result,
          })
        }
      },
      fail(err) {
        console.error(err)
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      }
    })
  },
  async cardMyList() {
    const res = await WXAPI.cardMyList(wx.getStorageSync('token'))
    if (res.code == 0) {
      const myCards = res.data.filter(ele => { return ele.status == 0 })
      if (myCards.length > 0) {
        this.setData({
          myCards: res.data
        })
      }
    }
  },
  editNick() {
    this.setData({
      nickShow: true
    })
  },
  async _editNick() {
    if (!this.data.nick) {
      wx.showToast({
        title: '请填写昵称',
        icon: 'none'
      })
      return
    }
    const postData = {
      token: wx.getStorageSync('token'),
      nick: this.data.nick,
    }
    const res = await WXAPI.modifyUserInfo(postData)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '设置成功',
    })
    this.getUserApiInfo()
  },
  async onChooseAvatar(e) {
    console.log(e);
    const avatarUrl = e.detail.avatarUrl
    let res = await WXAPI.uploadFileV2(wx.getStorageSync('token'), avatarUrl)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    res = await WXAPI.modifyUserInfo({
      token: wx.getStorageSync('token'),
      avatarUrl: res.data.url,
    })
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '设置成功',
    })
    this.getUserApiInfo()
  },
  goUserCode() {
    wx.navigateTo({
      url: '/pages/my/user-code',
    })
  },
  customerService() {
    wx.openCustomerServiceChat({
      extInfo: {url: wx.getStorageSync('customerServiceChatUrl')},
      corpId: wx.getStorageSync('customerServiceChatCorpId'),
      success: res => {},
      fail: err => {
        console.error(err)
      }
    })
  },
  copyUid() {
    wx.setClipboardData({
      data: this.data.apiUserInfoMap.base.id + '',
    })
  },
  login() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
})