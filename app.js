//app.js
const api = require('./utils/api')

App({
  onLaunch: function (options) {
    // console.log(options,'app launch')
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        // const latitude = res.latitude
        // const longitude = res.longitude
        // const speed = res.speed
        // const accuracy = res.accuracy
      }
    })

    if (!(wx.getStorageSync('uinfo') && wx.getStorageSync('uinfo').token)) {
      this.goLogin()
    }
    let thatt = this
    this.afterLogin(thatt, () => {
      thatt.getCityInfo()
    })
    wx.onNetworkStatusChange((res) => {
      thatt.isConnected = res.isConnected
      console.log(res.isConnected, 'isConnected')
      console.log(res.networkType, 'networkType')
      // wx.showToast({
      //   title: `${res.isConnected}`,
      // })
    })

    // wx.login({
    //   success: res => {
    //     console.log(res.code + '码login code')
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.nickName = res.userInfo.nickName
              this.userIcon = res.userInfo.avatarUrl

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow(res) {
    console.log(res,'app onshow data')
    if (res.scene === 1038) { // 场景值1038：从被打开的小程序返回
      const { appId, extraData } = res.referrerInfo
      if (appId == 'wxbd687630cd02ce1d') { // appId为wxbd687630cd02ce1d：从签约小程序跳转回来
        if (typeof extraData == 'undefined') {
          // TODO
          // 客户端小程序不确定签约结果，需要向商户侧后台请求确定签约结果
          return;
        }
        if (extraData.return_code == 'SUCCESS') {
          // TODO
          // 客户端小程序签约成功，需要向商户侧后台请求确认签约结果
          var contract_id = extraData.contract_id
          this.contractId = contract_id
          wx.reLaunch({
            url: '../index/index'
          })
          return;
        } else {
          // TODO
          // 签约失败
          return;
        }
      }
    }
  },
  goLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          api.Login({
            authcode: res.code,
          }).then(({
            data
          }) => {
            wx.setStorage({
              key: 'uinfo',
              data: {
                // phone: '17764592651',
                token: data.id_token
              },
              success: () => {
                resolve()
              },
              fail: () => {
                resolve()
              }
            })
            // resolve()
          })
        },
        fail() {
          reject()
        }
      })
    })
  },
  getCityInfo() {
    // let that = this
    api.getCityList({
    }).then(
      ({ data }) => {
        this.cityList = data || []
        // let { cityName, cardName } = this.pickCityName(this.cityList, this.cityCode)
        // this.cityName = cityName
        // this.cardName = cardName
        if (data[0]) {
          this.cityCode = data[0].cityCode
          this.cityName = data[0].cityName
          this.cardName = data[0].cardName
        }
        if (this.cityInfoReadyCallback) {
          let res = {
            cityName: this.cityName,
            cardName: this.cardName,
            cityList: this.cityList
          }
          this.cityInfoReadyCallback(res)
        }
      })
  },
  pickCityName(arr, cityCode) {
    let res = null
    arr.forEach((item, index) => {
      if (cityCode === item.cityCode) {
        res = {
          cityName: item.cityName,
          cardName: item.cardName
        }
      }
    })
    return res
  },
  afterLogin(that, call) {
    if ((wx.getStorageSync('uinfo') && wx.getStorageSync('uinfo').token)) {
      call()
    } else {
      var count = 0;
      var t = setInterval(() => {
        if ((wx.getStorageSync('uinfo') && wx.getStorageSync('uinfo').token)) {
          clearInterval(t)
          call();
        } else {
          if (count >= 300) { // 30s未成功则登录失败
            clearInterval(t)
            wx.showToast({
              title: "获取登录信息失败",
              icon: 'none',
              duration: 1000
            })
          }
          count++;
        }
      }, 100)
    }
  },
  afterGetCitycode(that, call) {
    if (this.cityCode) {
      call()
    } else {
      var count = 0;
      var t = setInterval(() => {
        if (this.cityCode) {
          clearInterval(t)
          call();
        } else {
          if (count >= 300) {
            clearInterval(t)
            wx.showToast({
              title: "获取城市信息失败",
              icon: 'none',
              duration: 1000
            })
          }
          count++;
        }
      }, 100)
    }
  },
  nickName: '',
  userIcon: '',
  ...api,
  needCheckSession: true,
  cityList: [],
  cityCode: "",
  cityName: '',
  cardName: '',
  cardNo: '',
  isConnected: true,
  contractId: '',
  userId: '',
  isSocketClose: true,
  qrType: ''
})