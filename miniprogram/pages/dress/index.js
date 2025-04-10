// pages/dress/index.js
Page({
  data: {
    dressList: [],
    currentIndex: 0
  },

  onLoad() {
    this.loadDressData();
  },

  async loadDressData() {
    this.setData({
      dressList: await this.getDefaultData(),
      currentIndex: 0
    });


    // try {
    //   const db = wx.cloud.database();
    //   const res = await db.collection('daily_dress')
    //     .where({
    //       date: wx.cloud.database().command.eq(this.getToday())
    //     })
    //     .limit(10)
    //     .get();

    //   this.setData({
    //     dressList: res.data.length ? res.data : await this.getDefaultData(),
    //     currentIndex: 0
    //   });
    // } catch (e) {
    //   wx.showToast({
    //     title: '数据加载失败',
    //     icon: 'none'
    //   })
    // }
  },

  getToday() {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  },

  async getDefaultData() {
    // return wx.cloud.callFunction({
    //   name: 'getDefaultDress',
    //   data: {
    //     count: 10
    //   }
    // });
    return [{
      imageUrl: 'https://img2.91mai.com/o2o/image/2024c15c-6be9-4877-9240-0fefcb7ef4c7.jpg',
      desc: '女性穿搭1',
    }, {
      imageUrl: 'https://img2.91mai.com/o2o/image/2024c15c-6be9-4877-9240-0fefcb7ef4c7.jpg',
      desc: '女性穿搭2',
    }]
  },

  swiperChange(e) {
    this.setData({
      currentIndex: e.detail.current
    });
  }
});