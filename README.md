# 小程序

+ [小程序调起支付API](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=5)
+ [小程序调起支付API](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.requestPayment.html)


## 支付

payment: function (cb) {
  wx.requestPayment({
    timeStamp: new Date().getTime(),
    nonceStr: '',
    package: '',
    signType: 'MD5',
    paySign: '',
    success (res) { },
    fail (res) { }
  })
},
