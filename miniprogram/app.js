//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'xcxjc-eb320d',
        traceUser: true,
      })
    }
    wx.getSystemInfo({
      success: e => {
        console.log(e);
        this.globalData.windowWidth = e.windowWidth;
      }
    })
  },
  globalData: {
    share_title: "「短网址链接」全网最好用的短网址制作程序",
    share_url: "https://ws3.sinaimg.cn/large/005BYqpggy1g3sbkp59o1j30zk0sfn1j.jpg"
  },
  url:'https://github.com/xuhuai66'//更换你的后台地址
})
