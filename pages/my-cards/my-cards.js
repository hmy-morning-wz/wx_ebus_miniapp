//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cardLists: [],
    tapStatus: false
  },
  //事件处理函数
  bindViewTap: function (event) {
    if (this.data.tapStatus) {
      return
    }
    this.setData({
      tapStatus: true
    })
    console.log(event.currentTarget.dataset.obj)
    let { cityCode } = event.currentTarget.dataset.obj
    if (cityCode) {
      app.cityCode = cityCode
      for (let o in app.cityList) {
        if (app.cityList[o].cityCode === cityCode) {
          app.cityName = app.cityList[o].cityName
          app.cardName = app.cityList[o].cardName
        }
      }
    }
    wx.reLaunch({
      url: '../index/index'
    })
  },
  getCardList() {
    app.getCardList({
    }).then(
      ({ data }) => {
        this.setData({
          cardLists: data || []
        })
        console.log('getCardList', data)
      })
  },
  onLoad: function () {
    this.getCardList()
  }
})
