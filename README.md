﻿# 小程序

- [小程序调起支付 API](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=5)
- [小程序调起支付 API](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.requestPayment.html)
- [发送模板消息](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/template-message/sendTemplateMessage.html)
- [获取小程序 access_token](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/access-token/getAccessToken.html)

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

## API

域名： `https://serverssl.szdazizai.com/`

暂不支持 `https`

1.  获取用户 openid

**method**

`GET`

**url**

`/wx/openid?code=code`

**param**

code: [wx.login 返回的 code](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html)

**response**

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "session_key": "1Iym9reDZ43NszXXibR19g==",
    "openid": "omG4c5PUfr5GTcCLxf2SIH6Buw60"
  }
}
```

1.  1 获取用户信息及闹钟信息

**method**

`GET`

**url**

`/user?id=openid`

**param**

id: 用户的 openid

**response**

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "orderlist": [
      {
        "uid": 1111,
        "paytime": "2018-10-26T03:34:06.000Z",
        "start_date": "2018-10-26T03:34:06.000Z",
        "push_days": 21,
        "push_time": "20:34",
        "createdAt": "2018-10-26T03:33:58.000Z",
        "updatedAt": "2018-10-26T03:33:58.000Z"
      }
    ],
    "pushlist": [
      {
        "id": 1,
        "uid": 1111,
        "msgid": 1,
        "createdAt": "2018-10-26T03:33:59.000Z",
        "updatedAt": "2018-10-26T03:33:59.000Z"
      },
      {
        "id": 2,
        "uid": 1111,
        "msgid": 3,
        "createdAt": "2018-10-26T03:33:59.000Z",
        "updatedAt": "2018-10-26T03:33:59.000Z"
      }
    ],
    "count": 2
  }
}
```

- orderlist: 用户的下单记录
- pushlist：用户的推送记录
- count：今日入睡人数

2.  获取最新的推送消息

**method**

`GET`

**url**

`/msg?id=msgid`

**param**

id: 推送消息的 id

**response**

```json
{
  "code": 0,
  "msg": "",
  "data": {
    "id": 1,
    "avatar": "http://img.jogiter.cn/lm.jpg",
    "nickname": "federer",
    "title": "测试1",
    "desc":
      "【乔迁献礼】新购存储、直播特惠资源包，享5折优惠，更有短视频 SDK、CDN 流量、日志分析等限时赠送！购买特惠资源包请至“财务统计->购买资源包”处进行购买。",
    "image": "http://img.jogiter.cn/bg.jpg",
    "createdAt": "2018-10-26T03:33:58.000Z",
    "updatedAt": "2018-10-26T03:33:58.000Z"
  }
}
```

3. 下单接口


**method**

`GET`

**url**

`/setclock/`

**param**

- uid: opendid,
- start_date: new Date('2018-10-28'),
- push_days: 21,
- push_time: '16:30'





