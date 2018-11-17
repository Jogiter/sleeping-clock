const domain = "https://jogiter.ap-northeast-1.elasticbeanstalk.com";

//用户登陆获取openid
function getOpenid(cb) {
  wx.login({
    success: function(res) {
      let code = res.code;
      console.log(`code=>${code}`);
      if (code) {
        //发起网络请求
        wx.request({
          url: `${domain}/wx/openid?code=${code}`,
          success: function({ data }) {
            let openid = data.data.openid;
            console.log(`openid=>${openid}`);
            //存入本地
            wx.setStorage({
              key: "openid",
              data: openid,
              success: function() {
                console.log("openid已经存到本地");
              }
            });
            cb(null, openid);
          }
        });
      } else {
        console.log("登录失败！" + res.errMsg);
        cb(res.errMsg);
      }
    }
  });
}

function getUser(openid, cb) {
  wx.request({
    url: `${domain}/user?id=${openid}`,
    success: function({ data }) {
      cb(null, data);
    }
  });
}

getOpenid((err, openid) => {
  if (err) {
    console.log(err);
    return;
  }
  getUser(openid, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    if (res.code === 0) {
      let data = res.data;
      _this.globalData.userInfo = data;
    }
  });
});
