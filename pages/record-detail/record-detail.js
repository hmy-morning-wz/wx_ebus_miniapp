// pages/record-detail/record-detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getOrderDetail({
      replaceUrl: `/api/trip-detail/${options.id}`,
      cityCode:options.cityCode || app.cityCode,
      cardNo:options.cardNo || app.cardNo
    })
    .then((data)=>{
      if(data) {
        this.setData({
          recordDetail: data.data
        })
      }
    })
    console.log(this.data.recordDetail)
    // wx.getStorage({
    //   key: 'recordDetail',
    //   success: (res) => {
    //     console.log(res.data)
    //     this.setData({
    //       recordDetail: res.data
    //     })
    //   }
    // })
  },

})