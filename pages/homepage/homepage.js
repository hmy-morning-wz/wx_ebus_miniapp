//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    nickName: '我',
    userIcon: 'https://images.allcitygo.com/20200824155513116dUmvcZ.png'
  },
  //事件处理函数
  handleJumpRecords: function() {
    wx.navigateTo({
      url: '../travel-record/travel-record'
    })
  },
  handleJumpCards: function() {
    wx.navigateTo({
      url: '../my-cards/my-cards'
    })
  },
  onReady: function () {
    if (app.nickName) {
      this.setData({
        nickName: app.nickName,
        userIcon: app.userIcon
      })
    }
  }
})
