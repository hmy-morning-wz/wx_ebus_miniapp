const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isMergeableObject = val => {
  let s = null;
  return val && typeof val === 'object' && !!(s = Object.prototype.toString.call(val), 'RegExp|Date'.indexOf(s))
}
const deepMerge = (d, s) => {
  let rs = {...d}
  Object.keys(s).forEach(k => rs[k] = isMergeableObject(d[k]) && isMergeableObject(s[k]) ? deepMerge(d[k], s[k]) : s[k] || d[k])
  return rs
}

module.exports = {
  formatTime: formatTime,
  deepMerge
}
