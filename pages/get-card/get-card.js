//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cityName: app.cityName,
    cardName: app.cardName,
    iconList: [
      {
        icon: 'https://images.allcitygo.com/20200820153451466Ygo1dq.png',
        desc: '告别零钱'
      },
      {
        icon: 'https://images.allcitygo.com/20200820153514059XNyGFH.png',
        desc: '免密支付'
      },
      {
        icon: 'https://images.allcitygo.com/20200820153527056o39P6P.png',
        desc: '免付押金'
      }
    ],
    checked: false,
    btnLoading: false
  },
  //事件处理函数
  getPhoneNumber: function (e) {
    console.log(e, 'getPhoneNumber')
    if (e.detail.encryptedData) {
      this.setData({
        btnLoading: true
      })
      app.openCard({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }).then(
        (res) => {
          app.cardNo = res.data.cardNo
          wx.navigateToMiniProgram({
            appId: 'wxbd687630cd02ce1d',
            path: 'pages/index/index',
            extraData: res.data.extraData ? JSON.parse(res.data.extraData) : {},
            success(res) {
              // 成功跳转到签约小程序 
            // 成功跳转到签约小程序 
              // 成功跳转到签约小程序 
            },
            fail(res) {
              wx.showToast({
                title: '签约出现问题',
                icon: 'none',
                duration: 2000
              })
              // 未成功跳转到签约小程序 
            // 未成功跳转到签约小程序 
              // 未成功跳转到签约小程序 
            }
          })
        },
        () => {
          this.setData({
            btnLoading: false
          })
        })
    }
  },
  checkCircle: function () {
    console.log(app.cityName, app.cityList)
    this.setData({
      checked: !this.data.checked
    })
  },
  pickCity: function () {
    wx.navigateTo({
      url: '../pick-city/pick-city'
    })
  },
  seeProtocol: function () {
    // /320200/v1/protocol.htm
    let protocol = `${app.g.cdnHost}/${app.cityCode}/v1/index.html`
    wx.navigateTo({
      url: `../webview/webview?url=${protocol}`
    })
  },
  // 生命周期函数
  onReady: function () {
    this.setData({
      cityName: app.cityName,
      cardName: app.cardName
    })
    console.log('dev url', app.g.cdnHost)
  },
  onShow: function () {
    this.setData({
      btnLoading: false
    })
  }
})
