const app = getApp()

Page({
  data: {
    cityList: app.cityList,
    cityName: app.cityName,
    tapStatus: false
  },
  bindPickCity: function (event) {
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
      for (let o in this.data.cityList) {
        if (this.data.cityList[o].cityCode === cityCode) {
          app.cityName = this.data.cityList[o].cityName
          app.cardName = this.data.cityList[o].cardName
        }
      }
    }
    console.log(app.cityName, app.cityCode, 'cityName&cityCode')

    wx.reLaunch({
      url: '../index/index'
    })
  },
  onReady() {
    this.setData({
      cityList: app.cityList
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})