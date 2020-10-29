/**
 * dateformat 时间戳转天时分秒
 * @return
 */
export const dateformat = (mss) => {
  // 参数为毫秒
  const days = parseInt(mss / (1000 * 60 * 60 * 24))
  const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = (mss % (1000 * 60)) / 1000
  let d, h, m, s
  if (!localStorage.lang || localStorage.lang == 'zh') {
    d = '天'
    h = '时'
    m = '分'
    s = '秒'
  } else {
    d = 'Day'
    h = ':'
    m = ':'
    s = ''
  }
  let show_day = ''; let show_hours = ''; let show_minutes = ''
  if (days !== 0) {
    show_day = days + '<span class="time_margin">' + d + '</span>'
  }
  if (hours == 0) {
    if (days == 0) {
      show_hours = ''
    } else {
      show_hours = 0 + '<span class="time_margin">' + h + '</span>'
    }
  } else {
    show_hours = hours + '<span class="time_margin">' + h + '</span>'
  }
  if (minutes == 0) {
    if (days == 0 && hours == 0) {
      show_minutes = ''
    } else {
      show_minutes = 0 + '<span class="time_margin">' + m + '</span>'
    }
  } else {
    show_minutes = minutes + '<span class="time_margin">' + m + '</span>'
  }
  const show_seconds = seconds + '<span class="time_margin">' + s + '</span>'
  return show_day + show_hours + show_minutes + show_seconds
}
