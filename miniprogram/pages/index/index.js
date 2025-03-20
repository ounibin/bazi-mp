import dayjs from 'dayjs'
import lunisolar from 'lunisolar'
import {
  analyzeWuXing
} from '../../lib/suanming/index'
import Toast from '@vant/weapp/toast/toast'
import * as echarts from '../../ec-canvas/echarts';


let chart = null;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  const option = {
    xAxis: {
      type: 'category',
      data: ['金', '木', '水', '火', '土']
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [{
      data: [0, 0, 0, 0, 0],
      type: 'bar'
    }]
  };


  chart.setOption(option);
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendarType: '农历',
    showCalendarType: false,
    calendarTypeActions: [{
      name: '农历'
    }, {
      name: '阳历'
    }],
    showNongli: true,
    minDate: new Date(1900, 1, 1).getTime(),
    maxDate: new Date().getTime(),
    currentDate: dayjs('1992-12-01 07:00').valueOf(),
    baziStr: '',
    showCalendar: false,
    calendarMinDate: dayjs('1900-01-01 00:00').valueOf(),
    calendarMaxDate: dayjs().valueOf(),
    birthStr: '点击选择生日时辰',
    ec: {
      onInit: initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(`异步打印----dayjs('1900-01-01 00:00').valueOf(): `, dayjs('1900-01-01 00:00').valueOf())
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success: () => console.log('分享菜单已调起'),
      fail: () => console.log('分享菜单已关闭')
    });
  },

  onChangeCalendarType() {
    this.setData({
      showCalendarType: true
    })
  },

  onSelectCalendarType(e) {
    console.log(`异步打印----e.detail: `, e.detail)
    const {
      name
    } = e.detail
    this.setData({
      calendarType: name,
      showCalendarType: false
    })
  },

  onCloseCalendarType(e) {
    // console.log(`异步打印----e.detail: `, e.detail)
    this.setData({
      showCalendarType: false
    })

  },

  onChangeNongli() {
    this.setData({
      showNongli: !this.data.showNongli
    })
  },

  onShowCalendar() {
    this.setData({
      showCalendar: true

    })

  },
  onCloseCalendar() {
    this.setData({
      showCalendar: false

    })

  },

  onCloseCalendarActionSheet() {
    this.setData({
      showCalendar: false
    })
  },
  onConfirmCalendar(e) {
    console.log(`异步打印----e.detail: `, e.detail)
    this.setData({
      // currentDate: false

    })

  },
  onInputDate(e) {
    console.log(`选择的时间戳: `, e.detail)
    const date1 = new Date(e.detail)
    this.setData({
      birthStr: dayjs(e.detail).format('YYYY-MM-DD HH:mm'),
      year: date1.getFullYear(),
      month: date1.getMonth() + 1,
      day: date1.getDate(),
      hour: date1.getHours(),
      minute: date1.getMinutes(),
      showCalendar: false
    })
  },

  handleShare () {
    console.log(`异步打印----fenxiang: `, )
  },

  queryBazi() {


    if (!(/^\d/.test(this.data.birthStr))) {
      wx.showToast({
        title: '请输入生日时辰',
        icon: 'error',
        duration: 2000
      })
      return
    }
    

    this.setData({
      baziStr: '',
      missingWuXing: ''
    })

    let birth = ''
    if (this.data.calendarType === '农历') {
      const lunar = this.data.birthStr
      const {
        year,
        month,
        day,
        hour,
        minute
      } = this.data
      const lsr = lunisolar.fromLunar({
        year,
        month,
        day,
        hour,
        minute,
        isLeapMonth: false
      })
      birth = lsr.format('YYYY-MM-DD HH:mm')
      console.log(`异步打印----农历: `, lunar)
      console.log(`异步打印----农历转阳历: `, birth)
    } else {
      console.log(`异步打印----阳历: `, this.data.birthStr)

      birth = this.data.birthStr
    }

    const res = analyzeWuXing(birth)
    console.log(`异步打印----res: `, res)
    const baziStr = res.pillars.join(' ')
    const missingWuXing = res.missingWuXing.length === 0 ? '无' : res.missingWuXing.join('、')


    const wuxingInfo = res.wuXingDistribution
    const wuxingData = [
      { value: wuxingInfo['金'], itemStyle: { color: '#F5F0E6' } }, // 红色柱子
      { value: wuxingInfo['木'], itemStyle: { color: '#2D5A3D' } }, // 绿色柱子
      { value: wuxingInfo['水'], itemStyle: { color: '#2E3192' } }, // 蓝色柱子
      { value: wuxingInfo['火'], itemStyle: { color: '#C41E3A' } }, // 蓝色柱子
      { value: wuxingInfo['土'], itemStyle: { color: '#A57865' } } // 紫色柱子
    ].map((item) => {
      return {
        ...item,
        label: {
          show: true,
          position: 'top',
          color: '#666',
          fontSize: 14,
          formatter: '{c}' // 显示 "数值 + 件"
        }
      }
    })
    chart.setOption({
      series: [{
        data: wuxingData,
        type: 'bar'
      }]
    })
    console.log(`异步打印----baziStr123: `, baziStr)
    console.log(`异步打印----baziStr123: `, missingWuXing)



    wx.showLoading({
      title: '查询中...',
    })
    setTimeout(() => {

      this.setData({
        baziStr: baziStr,
        missingWuXing
      })
      wx.hideLoading()

    }, 1000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    setTimeout(() => {
      // 获取 chart 实例的方式
      console.log(chart)
      // const ecIns = this.data.ec.onInit()
    }, 2000);
  },

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
    path: '/pages/index/index',
    success: (res) => {
      // 分享成功
      this.setData({
        shareSuccess: true
      });
      // wx.showToast({
      //   title: '分享成功',
      //   icon: 'success',
      //   duration: 2000
      // });
      console.log('分享成功一次', res);
    },
    fail: (res) => {
      // 分享失败
      wx.showToast({
        title: '分享失败',
        icon: 'error',
        duration: 2000
      });
    }
  };
}
})