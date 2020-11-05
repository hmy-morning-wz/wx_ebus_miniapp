// pages/scan-succ/scan-succ.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '12'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderNo: options.id
    })
  },

  handleDetail: function() {
    wx.redirectTo({
      url: `../record-detail/record-detail?id=${this.data.orderNo}`
    })
  },
  handleScan: function() {
    wx.reLaunch({
      url: `../index/index`
    })
  }
})