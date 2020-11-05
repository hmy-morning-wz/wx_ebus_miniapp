const { deepMerge, formatTime } = require('./util')

const g = {
  url: {
    dev: 'https://sit-wechat-traffic.allcitygo.com',
    pro: 'https://wechat-traffic.allcitygo.com'
  }['pro'],
  wsUrl: {
    dev: 'wss://sit-wechat-traffic.allcitygo.com',
    pro: 'wss://wechat-traffic.allcitygo.com'
  }['pro'],
  cdnHost: {
    dev: 'https://static.allcitygo.com/sit/v4.1.1/h5/protocol',
    pro: 'https://static.allcitygo.com/public/qr/protocol/wechat'
  }['pro'],
  header: {
    'content-type': 'application/json'
  }
}

const genBody = (...bodys) => bodys.reduce(deepMerge, {})

const net = type => (url, ...args) => new Promise((resolve, reject) =>
  {
    console.log("do request...")
    let timerId =0 
    let requestTask = wx.request({
    ...genBody(g, ...args, {url: g.url + url, method: type}),
    success: (res) => {
      // console.log(res,'wx.request---res')
      resolve(res)
    },
    fail: reject,
    complete:()=>{
      clearTimeout(timerId)
      requestTask = null
      console.log("request complete",url)
    },
    timeout: 15000
  })
  timerId = setTimeout(()=>{
    requestTask && requestTask.abort()
    console.warn("request time out",url)
    reject({code:-1,msg:"request time out"})
  },20000)
}
)

const checkLogin = () => new Promise((resolve, reject) => 
{ console.log("checkLogin...")
  wx.checkSession({
    success: resolve,
    fail: () => { getApp().needCheckSession = false; reject() },
    complete:()=>{
      console.log("checkLogin complete")
    }
  })
}
)

module.exports = {
  doGet: net('GET'),
  doPost: net('POST'),
  checkLogin,
  formatTime,
  g
}