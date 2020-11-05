const { doGet, doPost, checkLogin, formatTime, g } = require('./service')
const sm2 = require('miniprogram-sm-crypto').sm2;
const { KJUR } = require('./jsrsasign-all-min')
const based64 = require('./based64')

const doNet = (url, request = doPost, needCityCode = true, needCheck = true, needToken = true, failCount = 0) => (data = {}, opts = {}) => new Promise((resolve, reject) => {
  console.log("doNet",url)
  if (data.replaceUrl) {
    url = data.replaceUrl
    delete data.replaceUrl
  }
  if (needToken) {
    try {
      let { token } = wx.getStorageSync('uinfo') || {}
      data = { ...data }
      opts = {
        "header": {
          'Authorization': "Bearer " + token
        },
        ...opts
      }
    } catch (e) {
      reject()
    }
  }

  if (needCityCode) {
    let { cityCode } = getApp() || {}
    data = { cityCode, ...data }
  }

  let toLogin = () => { 
    console.log("toLogin")
    getApp().goLogin().then(()=>{
      wx.reLaunch({ url: '../index/index' })
    })    
  }

  let succ = res => {
    console.log("succ",res)
    let { id_token } = res.data

    if (id_token) {
      wx.setStorageSync('uinfo', {
        ...wx.getStorageSync('uinfo') || {},
        token: id_token
      })
    }
    if ((res.statusCode == 401 || res.statusCode == 403) && (failCount <= 5)) {
      failCount++
      getApp().goLogin().then(() => {
        let obj = {
          "header": {
            'Authorization': "Bearer " + (wx.getStorageSync('uinfo').token)
          }
        }
        let opts2 = Object.assign(opts, obj);
        doNet(url, request, needCityCode, needCheck, needToken, failCount)(data, opts2).then(res => resolve(res));
      })
    } else if (res.statusCode == 500) {
      wx.showToast({
        title: '出错啦',
        icon: 'none',
        duration: 2000
      })
      reject({
        code: 500
      })
    } else {
      resolve(res);
    }

    // resolve(res)
  }
  let  fail = res => {
    console.warn("fail",res)
    wx.showToast({
      title: '网络异常',
      icon: 'none',
      duration: 2000
    })
    reject(res)
  }
  needCheck ? checkLogin().then(() => request(url, { data }, opts).then(succ, fail), toLogin)
    : request(url, { data }, opts).then(succ, fail)
})

/**
 * 判断奇偶
 */
const bnpIsEven = (t) => {
  return (t > 0 ? t & 1 : t) == 0
}
/**
 * 解析arrayBuffer到16进制字符串
 */
const parseArrayBufferToHex = (input) => {
  return Array.prototype.map.call(new Uint8Array(input), x => ('00' + x.toString(16)).slice(-2)).join('')
}
/**
 * 解析16进制字符串到arrayBuffer
 */
const hexToArrayBuffer = (hexCharCodeStr) => {
  var rawStr = hexCharCodeStr.trim()
  var len = rawStr.length
  if (len % 2 !== 0) {
    console.log('Illegal Format ASCII Code!')
    return ''
  }
  var result = []
  for (var i = 0; i < len; i = i + 2) {
    result.push(parseInt(rawStr.substr(i, 2), 16))
  }
  return result
}

const hexCharCodeToStr = (hexCharCodeStr) => {
  var rawStr = hexCharCodeStr.trim()
  var len = rawStr.length
  if (len % 2 !== 0) {
    console.log('Illegal Format ASCII Code!')
    return ''
  }
  var resultStr = []
  for (var i = 0; i < len; i = i + 2) {
    resultStr.push(String.fromCharCode(parseInt(rawStr.substr(i, 2), 16)))
  }
  return resultStr.join('')
}

const getQrCodeString = (privateKey, publicKey, qrcodeContent) => {
  let arrayBuffer = wx.base64ToArrayBuffer(qrcodeContent)
  let hex = parseArrayBufferToHex(arrayBuffer)
  let now = parseInt(Date.now() / 1000).toString(16)
  let m1 = hex + now
  let msg = hexToArrayBuffer(m1)
  // 纯签名 + 生成椭圆曲线点 + sm3杂凑（不做公钥推导）
  let sigValueHex5 = sm2.doSignature(msg, privateKey, {
    hash: true,
    publicKey, // 传入公钥的话，可以去掉sm3杂凑中推导公钥的过程，速度会比纯签名 + 生成椭圆曲线点 + sm3杂凑快
  });
  // console.log('各个字段: ', privateKey, publicKey, qrcodeContent, 'arrayBuffer', arrayBuffer, 'hex', hex, 'now time', now, 'msg', m1)
  // console.log('hex16进制:', m1 + '15' + sigValueHex5)
  let result = hexCharCodeToStr((m1 + '15' + sigValueHex5))
  return result
}

const hexToBytes = hex => {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16))
  }
  return bytes
}
const bytesToHex = bytes => {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16))
    hex.push((bytes[i] & 0xf).toString(16))
  }
  return hex.join('')
}
const getZfbQrCodeString = (privateKey, qrcodeContent) => {
  let pad = s => (s.length > 48 ? '0219' : '0218') + s
  // let arrayBuffer = wx.base64ToArrayBuffer(qrcodeContent)
  // let hexValue = parseArrayBufferToHex(arrayBuffer)
  var signData = qrcodeContent + '04' + parseInt(Date.now() / 1000).toString(16)
  var sig = new KJUR.crypto.Signature({ alg: 'SHA1withECDSA' })
  sig.initSign({ ecprvhex: privateKey, eccurvename: 'secp192k1' })
  sig.updateHex(signData)
  var sigValueHex = hexToBytes(sig.sign())
  var sigValueHexr = pad(bytesToHex(based64.decode1(sigValueHex).r))
  var sigValueHexs = pad(bytesToHex(based64.decode1(sigValueHex).s))
  var sign_Data1 =
    '30' +
    ((sigValueHexr + sigValueHexs).length / 2).toString(16) +
    sigValueHexr +
    sigValueHexs
  return hexCharCodeToStr(
    signData + (sign_Data1.length / 2).toString(16) + sign_Data1
  )
}

const compressPubKey = pubKey => {
  let y = parseInt(pubKey.substr(128, 2), 16)
  let compress = (bnpIsEven(y) ? '02' : '03') + pubKey.substr(2, 64)
  // console.log(compress, 'sm2 16进制公钥')
  let arrbuf = hexToArrayBuffer(compress)
  let userKey = wx.arrayBufferToBase64(arrbuf)
  // console.log(userKey)
  return userKey
}
const compressZfbPubKey = pubKey => {
  let y = parseInt(pubKey.substr(96, 2), 16)
  let compress = (bnpIsEven(y) ? '02' : '03') + pubKey.substr(2, 48)
  // console.log(compress, '椭圆 16进制公钥')
  // let arrbuf = hexToArrayBuffer(compress)
  // let userKey = wx.arrayBufferToBase64(arrbuf)
  return compress  
}

module.exports = {
  formatTime,
  g,
  checkLogin,
  getQrCodeString,
  getZfbQrCodeString,
  hexToArrayBuffer,
  bnpIsEven,
  compressPubKey,
  compressZfbPubKey,
  getCityList: doNet('/api/city/city-list', doGet, false),
  Login: doNet('/api/authenticate', doPost, false, false, false),
  getCardInfo: doNet('/api/card', doGet),
  openCard: doNet('/api/card'),
  getQrcode: doNet('/api/iqr/apply-qrcode'),
  getCardList: doNet('/api/card-list', doGet, false),
  getEbusRecords: doNet('/api/trip-list', doGet, false),
  doSignAgain: doNet('/api/signcontract'),
  getOrderDetail: doNet(`/api/trip-detail`, doGet, false)
}