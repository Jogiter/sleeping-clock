//index.js
//获取应用实例
const app = getApp();
const domain = "http://localhost:3000";

Page({
  data: {
    contactimg:'https://img.jogiter.cn/clock/779a57d7fe5b90e6ca7657031e9999939c128ebe',
    userInfo: {},
    hasUserInfo: false,
    hasSetClock: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    orderList: {},
    orderTxt: {},
    count: {},
    topimgsrc:
      "https://img.jogiter.cn/clock/b06f19aa822053b223437138c77569c20430fbc4",
    buttonimgsrc1:
      "https://img.jogiter.cn/clock/317b2ff96618b8c5c83ab448638e17cc3405b541",
    buttonimgsrc2:
      "https://img.jogiter.cn/clock/d6a4afe2e109e8e4c9f240e70a45efd126fd98f3"
  },

  // 事件处理函数
  // setClock: function() {
  //   wx.navigateTo({
  //     url: "../settime/index"
  //   });
  // },

  renew: function() {
    wx.navigateTo({
      url: "../settime/index"
    });
  },

  //拼凑成订单日期数据
  setOrderText: function(userinfo) {
    var _this = this;
    console.log(userinfo.start_date);
    console.log(userinfo.push_days);

    function dateToYMD(date) {
      var gap = ".";
      var d = date.getDate();
      var m = date.getMonth() + 1; //Month from 0 to 11
      var y = date.getFullYear();
      return (
        "" + y + gap + (m <= 9 ? "0" + m : m) + gap + (d <= 9 ? "0" + d : d)
      );
    }

    let start = dateToYMD(new Date(userinfo.start_date));
    let endDate = new Date(
      new Date(userinfo.start_date).getTime() +
        3600 * 1000 * 24 * userinfo.push_days
    );
    let end = dateToYMD(endDate);
    let txt = `${start}-${end} 每天 ${userinfo.push_time}`;
    console.log(txt);
    return txt;
    // _this.setData({
    //   orderTxt: txt
    // })
  },

  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    wx.setStorage({
      key: "userInfo",
      data: e.detail.userInfo,
      success: function() {
        console.log(e.detail.userInfo);
      }
    });

    //如果用户有userinfo和openid，立即执行注册register
    if (this.data.hasUserInfo) {
      if (app.globalData.openid) {
        app.register();
      }
      wx.navigateTo({
        url: "../settime/index"
      });
    }
  },

  onLoad: function() {
    var _this = this;

    //获取用户userInfo
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      wx.setStorage({
        key: "userInfo",
        data: app.globalData.userInfo,
        success: function() {
          console.log("已有用户信息" + app.globalData.userInfo);
        }
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo;

        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        wx.setStorage({
          key: "userInfo",
          data: res.userInfo,
          success: function() {
            console.log("已有用户信息2" + res.userInfo);
          }
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: function(res) {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          wx.setStorage({
            key: "userInfo",
            data: res.userInfo,
            success: function() {
              console.log("已有用户信息3" + res.userInfo);
            }
          });
        }
      });
    }

    if (app.globalData.openid) {
      this.getOrder();
      console.log("openid1" + app.globalData.openid);
    } else {
      app.openidCallback = res => {
        app.globalData.openid = res.data.data.openid;
        console.log("openid2" + app.globalData.openid);

        this.getOrder();
      };
    }

    //如果用户有userinfo和openid，立即执行注册register
    // if (this.data.hasUserInfo) {
    //   console.log('app.globaldata.openid1'+app.globalData.openid);
    //
    //
    //   if (app.globalData.openid) {
    //     app.register();
    //     console.log('app.globaldata.openid2'+app.globalData.openid);
    //   }
    // }

    //如果用户有openid,则请求orderlist数据，并执行得出orderTxt
  },

  getOrder: function() {
    var _this = this;

    //获取到了orderlist的信息

    if (app.globalData.openid) {
      wx.request({
        url: "https://serverssl.szdazizai.com/user",
        data: {
          id: app.globalData.openid
        },
        success: function(res) {
          let list = res.data.data.orderlist.map(item => {
            return _this.setOrderText(item);
          });

          _this.setData({
            orderList: list,
            count: res.data.data.count,
            hasSetClock: res.data.data.orderlist.length > 0
          });
        }
      });
    }
  },


  onShareAppMessage:e=>{


    return{
      title:'让有趣的灵魂跟你说晚安，试试哄睡闹钟吧~',

    }

  }
});
