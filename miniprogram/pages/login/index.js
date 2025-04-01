let timedown = 60
let timer = null
const BTN_CODE_TXT = '获取验证码'

Page({
  data: {
    phoneNumber: '',
    phoneNumberErrMsg: '',
    verificationCode: '',
    verificationCodeDisabled: false,
    verificationCodeStr: BTN_CODE_TXT,
    checked: false,
  },

  inputPhoneNumber(e) {
    this.setData({
      phoneNumber: e.detail.value
    });
  },

  inputVerificationCode(e) {
    this.setData({
      verificationCode: e.detail.value
    });
  },

  getVerificationCode() {
    console.log(`异步打印----timer: `, timer)
    if (timer > 0) {
      return
    }
    // 这里可以调用获取验证码的API
    console.log('获取验证码', this.data.phoneNumber);
    timer = setInterval(() => {
      if (timedown > 0) {
        timedown--;
        this.setData({
          verificationCodeDisabled: true,
          verificationCodeStr: timedown + 's后重新获取'
        });
      } else if (timedown === 0) {
        clearInterval(timer);
        this.setData({
          verificationCodeDisabled: false,
          verificationCodeStr: BTN_CODE_TXT
        });
        timedown = 60;
      }
    }, 1000);
  },


  xieyiChange(e) {
    this.setData({
      checked: e.detail,
    })
  },


  showModal() {
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

  login() {
    if (!this.data.checked) {
      this.showModal();

    }
    // 这里可以调用登录的API
    console.log('登录', this.data.phoneNumber, this.data.verificationCode);
  }
});