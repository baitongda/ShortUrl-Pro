var db = wx.cloud.database();
var common = require("../../common.js");
var  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      title: '我的转换',
      content: '短链接转换记录',
      key:'history',
      img:'https://ws3.sinaimg.cn/large/005BYqpggy1g3rug4pgh6j303k03kglg.jpg'
    },
    {
        title: '积分明细',
        content: '积分使用详情',
        key: 's_history',
      img: 'https://ws3.sinaimg.cn/large/005BYqpggy1g3ruhbmmt8j303k03kq2q.jpg'
      },
      {
        title: '常见问题',
        content: '解答您的各种疑问',
        key: 'help',
        img: 'https://ws3.sinaimg.cn/large/005BYqpggy1g3rui1pdvnj303k03kwe9.jpg'
      }]
  },
  onShow(){
    this.points();
  },
  //跳转其它页面
go(e){
  wx.navigateTo({
    url: '/pages/' + e.currentTarget.dataset.key + '/' + e.currentTarget.dataset.key,
  })
},
//获取积分
points(){
  var that = this;
  db.collection('points').where({
    _openid: app.globalData.id
  }).get({
    success(e) {
      if(e.data==''){
        that.setData({
          points: 0
        })
      }else{
      that.setData({
        points: e.data[0].point
      })
      }
    }
  })
},

  //分享配置
  onShareAppMessage: function () {
    return {
      title: app.globalData.share_title,
      path: "/pages/index/index",
      imageUrl: app.globalData.share_url
    };
  }, 
})