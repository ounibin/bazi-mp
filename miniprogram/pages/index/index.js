import dayjs from 'dayjs'
import lunisolar from 'lunisolar'
import towxml from '../../lib/towxml/index'
import {
  analyzeWuXing
} from '../../lib/suanming/index'
import * as echarts from '../../lib/ec-canvas/echarts'


// const towxml = new Towxml('markdown');

let chart = null

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  })
  canvas.setChart(chart)

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
  }


  chart.setOption(option)
  return chart
}


function getHour(chineseHour) {
  const i = [
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
  ].findIndex(item => item === chineseHour)
  return [
    '23:00',
    '1:00',
    '3:00',
    '5:00',
    '7:00',
    '9:00',
    '11:00',
    '13:00',
    '15:00',
    '17:00',
    '19:00',
    '21:00',
  ][i]
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendarType: '农历',
    selectedDate: '',
    chineseHour: '',
    baziStr: '',
    missingWuXingStr: '',
    ec: {
      onInit: initChart
    },
    markdownContent: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 假设你从服务器获取到的 Markdown 文本
    const markdownText = `# 标题\n\n这是 **加粗** 的文本。\n\n- 列表项1\n- 列表项2`;

    // 解析 Markdown 文本
    // const parsedContent = towxml.toJson(markdownText, 'markdown');
    const parsedContent = towxml(markdownText, 'markdown');

    // 将解析后的内容设置到页面数据中
    this.setData({
      markdownContent: parsedContent
    });
  },

  goEditBirth() {
    wx.navigateTo({
      url: '/pages/editBirth/index'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const calendarType = wx.getStorageSync('calendarType')
    const selectedDate = wx.getStorageSync('selectedDate')
    const chineseHour = wx.getStorageSync('chineseHour')
    this.setData({
      calendarType,
      selectedDate,
      chineseHour
    })



    const time = getHour(chineseHour)
    const birthStr = selectedDate + ' ' + time
    const dayjs_instance = dayjs(birthStr)
    let birth = ''
    if (calendarType === '农历') {
      const year = dayjs_instance.year()
      const month = dayjs_instance.month() + 1
      const day = dayjs_instance.date()
      const hour = dayjs_instance.hour()
      const minute = dayjs_instance.minute()
      const lsr = lunisolar.fromLunar({
        year,
        month,
        day,
        isLeapMonth: false
      })
      birth = lsr.format('YYYY-MM-DD') + ' ' + time
      console.log(`异步打印----农历转阳历: `, birth)
    } else {

      birth = birthStr
    }
    console.log(`异步打印----要分析的阳历: `, birth)
    const res = analyzeWuXing(birth)
    console.log(`异步打印----分析结果: `, res)
    const { pillars, wuXingDistribution, missingWuXing } = res
    const baziStr = pillars.join(' ')
    const missingWuXingStr = missingWuXing.length === 0 ? '无' : missingWuXing.join('、')

    this.setData({
      baziStr,
      missingWuXingStr
    })


    const wuxingData = [
      { value: wuXingDistribution['金'], itemStyle: { color: '#D89113' } },
      { value: wuXingDistribution['木'], itemStyle: { color: '#3FB043' } },
      { value: wuXingDistribution['水'], itemStyle: { color: '#3A73F1' } },
      { value: wuXingDistribution['火'], itemStyle: { color: '#C50201' } },
      { value: wuXingDistribution['土'], itemStyle: { color: '#8D7047' } }
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
    setTimeout(() => {
      chart.setOption({
        series: [{
          data: wuxingData
        }]
      })
    }, 1000)

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

  }
})