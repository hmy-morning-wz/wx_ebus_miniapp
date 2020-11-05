//index.js
//获取应用实例
const app = getApp()
const {
  getCardInfo, getQrCodeString, getZfbQrCodeString, getQrcode, hexToArrayBuffer, bnpIsEven, doSignAgain, compressPubKey, compressZfbPubKey
} = getApp()
const {
  createQrCodeImg
} = require('../../utils/wxqrcode.js')
const { KJUR } = require('../../utils/jsrsasign-all-min')
const sm2 = require('miniprogram-sm-crypto').sm2;

Page({
  data: {
    isLoading: true,
    cityName: app.cityName,
    cardName: app.cardName,
    nickName: '我',
    userIcon: 'https://images.allcitygo.com/20200824155513116dUmvcZ.png',
    disabled: true,
    disableCode: 1,
    disableCode2: '',
    disabledTips: '出现错误',
    refreshStatus: false,
    qrCodeImg: '',
    qrcodeContent: '',
    timer: null,//定时器
    compressKey: '',
    btnDisable: false,
    isSocketConnected:false,
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
    let userInfo = e.detail.userInfo
    if (userInfo) {
      app.userIcon = userInfo.avatarUrl
      app.nickName = userInfo.nickName
      this.setData({
        userIcon: userInfo.avatarUrl,
        nickName: userInfo.nickName
      })
    }
    wx.navigateTo({
      url: '../homepage/homepage'
    })
  },
  getPhoneNumber(e) {
    console.log('获取手机号')
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  getBusCardInfo() {
    let that = this
    getCardInfo({
      contractId: app.contractId
    }).then(
      ({ data }) => {
        console.log('查询卡信息', data)
        wx.hideLoading()  
        if (!!!data.cardNo) {
          if(app.contractId ) {           
            app.countBusCardInfo = (app.countBusCardInfo || 0 ) +1
             if( app.countBusCardInfo<30) {
              wx.showLoading({
                title: '正在开通中',
                mask: true
              })
               setTimeout(()=>{
               this.getBusCardInfo()              
             },1000)
            }else {
              wx.showToast({
                title: '开通超时',
              })
              wx.redirectTo({
                url: '../get-card/get-card'
              })
            }
          }else {
          wx.redirectTo({
            url: '../get-card/get-card'
          })
        }
        } else {
          app.cardNo = data.cardNo
          app.qrType = data.qrType
          let compressKey = this.generateUserKey()
          this.setData({
            compressKey           
          })
          // 建立连接

         /* if (app.isSocketClose) {
            this.reconnectSocket(0)            
          }*/

          let {
            cardNo,
            disabled,
            disabledCode,
            disabledTips,
            userId
          } = data
          app.cardNo = cardNo
          app.userId = userId
          wx.hideLoading()
          this.setData({
            disabled,
            disabledTips: disabledTips || '出现错误',
            disableCode2: disabledCode,
            isLoading: false
          })
          // console.log(this.data.disableCode2)
          let that = this
          clearTimeout(that.data.timer)
          if (!!!disabled) {
            this.getQrcodeContent()
            this.keepTime(this)
          }
        }
      },
      (err) => {
        wx.hideLoading()
        this.setData({
          isLoading: false,
          disabled: true,
          disableCode: err.code === 500 ? 1 : 2,
          disableCode2: ''
        })
        let that = this
        clearTimeout(that.data.timer)
      })
  },
  generateUserKey() {
    if (app.qrType === 1) {
      var ec = new KJUR.crypto.ECDSA({ 'curve': 'secp192k1' });
      var keypair = ec.generateKeyPairHex();
      var pubhex = keypair.ecpubhex; // hexadecimal string of EC public key
      var prvhex = keypair.ecprvhex; // hexadecimal string of EC private key (=d)
      console.log('hexadecimal string of EC public key', pubhex, prvhex)
      this.setData({
        publicKey: pubhex, // 公钥
        privateKey: prvhex // 私钥
      })
      let ecdKey = compressZfbPubKey(pubhex)
      return ecdKey
    } else {
      let keypair = sm2.generateKeyPairHex();
      this.setData({
        publicKey: keypair.publicKey, // 公钥
        privateKey: keypair.privateKey // 私钥
      })
      let userKey = compressPubKey(keypair.publicKey)
      while (userKey.indexOf('0d0a') > -1) {
        console.log('压缩公钥无效', userKey)
        keypair = null
        keypair = sm2.generateKeyPairHex();
        this.setData({
          publicKey: keypair.publicKey, // 公钥
          privateKey: keypair.privateKey // 私钥
        })
        userKey = compressPubKey(keypair.publicKey)
      }
      return userKey
    }
  },
  getQrcodeContent() {
    if (!app.isConnected) {
      console.log('not connect getqrcode')
      this.setData({
        disableCode: 2,
        disabled: true
      })
      let that = this
      clearTimeout(that.data.timer)
      return
    }    
    //app.isSocketClose = true //force reconnect
    //app.connectSocketing  = false
    this.reconnectSocket(0)
    // let userKey = this.generateUserKey()
    getQrcode({
      cardNo: app.cardNo,
      userKey: this.data.compressKey
    }).then(
      ({ data }) => {
        wx.hideLoading()
        let { qrcodeContent, expiryTime } = data
        this.setData({
          qrcodeContent
        })
        if (qrcodeContent) {
          let qrcodeStr
          if (app.qrType === 1) {
            qrcodeStr = getZfbQrCodeString(this.data.privateKey, this.data.qrcodeContent)
          } else {
            qrcodeStr = getQrCodeString(this.data.privateKey, this.data.publicKey, this.data.qrcodeContent)
          }
          // console.log('string:', qrcodeStr)
          this.setData({
            disabled: false,
            qrCodeImg: createQrCodeImg(qrcodeStr),
            refreshStatus: true
          })
          setTimeout(() => {
            this.setData({
              refreshStatus: false
            })
          }, 3000);
        } else {
          this.setData({
            disableCode: 1,
            disabled: true,
            disableCode2: ''
          })
          let that = this
          clearTimeout(that.data.timer)
        }
      },
      (err) => {
        wx.hideLoading()
        this.setData({
          disableCode: err.code === 500 ? 1 : 2,
          disabled: true,
          disableCode2: ''
        })
        let that = this
        clearTimeout(that.data.timer)
      })
  },
  pickCity: function () {
    wx.navigateTo({
      url: '../pick-city/pick-city'
    })
  },
  keepTime: function (that) {
    if (!app.isConnected) {
      that.setData({
        disableCode: 2,
        disabled: true
      })
      clearTimeout(that.data.timer)
      return
    }
    let timeTem = setTimeout(() => {
      console.log('timeout执行')
      that.getQrcodeContent()
      that.keepTime(that);
    }, 60000);
    that.setData({
      timer: timeTem
    });
  },
  doRefresh: function () {
    wx.showLoading({
      title: 'Loading',
      mask: true
    })
    if (!app.isConnected) {
      this.setData({
        disableCode: 2,
        disabled: true
      })
      wx.hideLoading()
      return
    }
    if (app.cardNo) {
      this.getQrcodeContent()
    } else {
      this.getBusCardInfo()
    }
    let that = this
    clearTimeout(that.data.timer)
    this.keepTime(this)
  },
  signAgain: function () {
    if (this.data.btnDisable) {
      return
    }
    wx.showLoading({
      title: 'Loading',
      mask: true
    })
    doSignAgain({
      cardNo: app.cardNo,
    }).then(
      ({ data }) => {
        wx.hideLoading()
        app.cardNo = data.cardNo
        wx.navigateToMiniProgram({
          appId: 'wxbd687630cd02ce1d',
          path: 'pages/index/index',
          extraData: data.extraData ? JSON.parse(data.extraData) : {},
          success() {
          },
          fail() {
            wx.hideLoading()
            this.setData({
              btnDisable: false
            })
            wx.showToast({
              title: '签约出现问题',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    )
  },
  // 生命周期函数
  onShow() {
    this.setData({
      btnDisable: false
    })
    
    if (!!!this.data.disabled) {
      let that = this
      clearTimeout(that.data.timer)
      this.getQrcodeContent()
      this.keepTime(this)
    }
    if (!app.isConnected) {
      this.setData({
        isLoading: false,
        disableCode: 2,
        disabled: true
      })
    }
    if (app.contractId) {
      this.setData({
        isLoading: true
      })
      wx.showLoading({
        title: 'Loading',
        mask: true
      })
      this.getBusCardInfo()
    }
    app.closeSocket=false
    if (app.userId && app.isSocketClose) {      
      this.reconnectSocket(0)     
    }
    this.setData({isSocketConnected: !app.isSocketClose})
    this.checkConnect()
  },
  checkConnect(){
    if(this.socketTimerId ) {
      clearInterval(this.socketTimerId)
      this.socketTimerId= 0
    }
    this.socketTimerId =  setInterval(()=>{
      console.log("check  Socket")
      app.socketCheckCnt = (app.socketCheckCnt || 0) +1
      if(app.isSocketClose || app.socketCheckCnt> 3) {
         if(app.socketCheckCnt>= 2) {
           app.connectSocketing  = false
           app.socketCheckCnt = 0
          }          
          this.reconnectSocket()
       }
       else if(app.socketTask && !app.isSocketClose) {
        app.socketTask.send({
          data: `hello ${app.userId}`,
          success:()=>{
            console.log("send hello success")
            app.socketCheckCnt = 0
          },
          fail:(res) => {
            console.warn("send hello res",res)
          }
        })
       }
    },10000)  
  },
  connected(){
    this.setData({isSocketConnected:true})
  },
  closeSocket() {
    if(this.socketTimerId ) {
      clearInterval(this.socketTimerId)
      this.socketTimerId= 0
    }
    if(app.socketTask) {
      try{
        app.socketTask.close({success:()=>{
          console.log("socketTask close")
        }})
        app.socketTask= null
        }catch(e) {}
    
      app.socketTask = null
     }
     app.closeSocket = true
     app.isSocketClose = true
     this.setData({isSocketConnected:false})
  },

  reconnectSocket(time){
    if(!app.closeSocket) {
      setTimeout(()=>{
      if(app.userId && app.isSocketClose && !app.connectSocketing ) {
        
       if(!app.closeSocket) {
         if(app.socketTask) {
          app.socketTask.close({success:()=>{
            console.log("socketTask close")
            this.reconnectSocket()
          }})
          app.socketTask= null
         }else {   
        app.connectSocketing = true           
        app.socketTask =  wx.connectSocket({
          url: `${app.g.wsUrl}/connect_ws/${app.userId}`,
          success:()=>{
            console.log("connectSocket call success")
          },
          fail:(res)=>{
            console.warn("connectSocket call fail",res)
          }
        })
      }
         //连接成功
      wx.onSocketOpen(() => {
        app.isSocketClose = false
        app.connectSocketing = false        
        console.log('on socket链接成功')
        this.connected()
        // wx.sendSocketMessage({
        //   data: 'success',
        // })
      })
      //接收数据
      wx.onSocketMessage(function ({ data }) {
        console.log(data, 'socketdata')
        if (data.indexOf('scan') > -1) {
          let arr = data.split(':')
          app.socketTask && app.socketTask.send({
            data: `got ${arr[1]} reply by ${app.userId}`,
            success:()=>{
              console.log("send reply success")
            },
            fail:(res) => {
              console.warn("send reply res",res)
            }
          })
          setTimeout(()=>{
            wx.navigateTo({
              url: `../scan-succ/scan-succ?id=${arr[1]}`
            })
          },100)                   
        }
      })
      //连接失败
      wx.onSocketClose(()=> {
        console.log('onSocketClose');
        app.isSocketClose = true
        app.connectSocketing = false
        this.setData({isSocketConnected:false})
        this.reconnectSocket() 
      })
      wx.onSocketError(()=> {
        console.log('onSocketError');
        app.isSocketClose = true
        this.setData({isSocketConnected:false})
      })
        
      }
      }
    },time||1000)    
  }
  },

  onLoad: function () {
    if (app.nickName) {
      this.setData({
        nickName: app.nickName,
        userIcon: app.userIcon
      })
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({
          nickName: res.userInfo.nickName,
          userIcon: res.userInfo.avatarUrl
        })
      }
    }
    if (app.cityName) {
      this.setData({
        cityName: app.cityName,
        cardName: app.cardName
      })
    } else {
      app.cityInfoReadyCallback = res => {
        this.setData({
          cityName: res.cityName,
          cardName: res.cardName
        })
      }
    }
    if (!app.isConnected) {
      this.setData({
        isLoading: false,
        disableCode: 2,
        disabled: true
      })
    }  
  },
  onReady() {
    wx.showLoading({
      title: 'Loading',
      mask: true
    })
    if (!app.isConnected) {
      this.setData({
        isLoading: false,
        disableCode: 2,
        disabled: true
      })
    }
    app.afterGetCitycode(this, () => {
      this.getBusCardInfo()
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    let that = this;
    //this.closeSocket() 
    clearTimeout(that.data.timer); //清除定时器
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    clearTimeout(that.data.timer); //清除定时器
  },
})