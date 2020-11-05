//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    travelRecords: [],
  },
  //事件处理函数
  bindViewTap: function (event) {
    let {cityCode,cardNo,serialNo} = event.currentTarget.dataset.obj || {}
    wx.navigateTo({
      url: `../record-detail/record-detail?id=${serialNo}&cityCode=${cityCode}&cardNo=${cardNo}`
    })
    // wx.setStorage({
    //   key: "recordDetail",
    //   data: event.currentTarget.dataset.obj,
    //   complete: () => {
    //     wx.navigateTo({
    //       url: '../record-detail/record-detail'
    //     })
    //   }
    // })
  },
  getEbusRecords() {
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    let now = new Date()
    app.getEbusRecords({
      year: now.getFullYear(),
      month: now.getMonth() + 1
    }).then(
      ({ data }) => {
        wx.hideLoading()
        this.setData({
          travelRecords: data || []
        })
        console.log('getEbusRecords', data)
      })
  },
  onLoad: function () {
    this.getEbusRecords()
  }
})
