//index.js
//获取应用实例
const app = getApp();
const domain = 'http://localhost:3000'

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    hasSetClock: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    orderinfo: {},
    orderTxt: {},
    count:{},
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
    var _this=this;
    let start = new Date(userinfo.start_date).toLocaleDateString().split('/').join('.')
    let end = new Date(new Date(userinfo.start_date).getTime() + 3600 * 1000 * 24 * userinfo.push_days).toLocaleDateString().split('/').join('.')
    let txt = `${start}-${end} 每天 ${userinfo.push_time}`
    _this.setData({
      orderTxt: txt
    })
    console.log(_this.data.orderTxt);
  },


  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.setStorage({
      key: 'userInfo',
      data: e.detail.userInfo,
      success: function() {
        console.log(e.detail.userInfo);
      }
    })

    //如果用户有userinfo和openid，立即执行注册register
    if (this.data.hasUserInfo) {

      if (app.globalData.openid) {
        app.register();
      }
      wx.navigateTo({
          url: '../settime/index',
        }

      )
    }
  },

  onLoad: function() {
    var _this=this;

    //获取用户userInfo
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.setStorage({
        key: 'userInfo',
        data: app.globalData.userInfo,
        success: function() {
          console.log("已有用户信息" + app.globalData.userInfo);
        }
      })

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo;

        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorage({
          key: 'userInfo',
          data: res.userInfo,
          success: function() {
            console.log("已有用户信息2" + res.userInfo);


          }
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: function(res) {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.setStorage({
            key: 'userInfo',
            data: res.userInfo,
            success: function() {
              console.log("已有用户信息3" + res.userInfo);
            }
          })
        }
      })
    }



if(app.globalData.openid){

  this.getOrder();
  console.log('openid1'+app.globalData.openid);

}
else{

  app.openidCallback = res =>{
    app.globalData.openid=res.data.data.openid;
    console.log('openid2'+app.globalData.openid);

    this.getOrder();

  }

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


  getOrder:function(){

    var _this=this;

    //获取到了orderlist的信息

    if (app.globalData.openid) {
      wx.request({
        url: 'http://alarm-env.ap-northeast-1.elasticbeanstalk.com/user',
        data: {
          id: app.globalData.openid
        },
        success: function(res) {

          if (res.data.data.orderlist.length > 0) {
            _this.setData({
              orderinfo: res.data.data.orderlist,
            })
            console.log("orderinfo"+_this.data.orderinfo);
          }

          //给count赋值

          _this.setData({
            count:res.data.data.count,
          })
          console.log('count'+_this.data.count);


//把orderinfo写成前端展示格式
          if (_this.data.orderinfo) {
            var user_info=_this.data.orderinfo;
            _this.setOrderText(user_info);
            _this.setData({
              hasSetClock: true,
            })
            console.log("是否有订单"+_this.data.hasSetClock);

          }



        }
      })
    }
  }
});
