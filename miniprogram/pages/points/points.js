var db = wx.cloud.database();
var common = require("../../common.js");
var  app = getApp();
let rewardedVideoAd = null;
Page({
  data: {

  },
  onLoad: function (options) {
    this.ads();
  },
onShow(){
  this.check_q();
  this.check_v();
  this.check_p();
},
  //配置激励广告
  ads: function () {
    var that = this;
    if (wx.createRewardedVideoAd) {
      rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-0c9efd8f8bf957ee'
      })
      rewardedVideoAd.onLoad()
      rewardedVideoAd.onError((err) => {
        console.log(err)
      })
      rewardedVideoAd.onClose((res) => {
        if (res && res.isEnded) {
          that.add(2);//增加2积分
          that.history('观看小视频', '+2')
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '中途退出无法获得积分奖励哦',
            success(res) {
              if (res.confirm) {
                that.openad();
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })
    }
  },
  //打开激励
  openad: function () {
    if (rewardedVideoAd) {
      rewardedVideoAd.show();
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '当前版本不支持观看，请更新再来',
      })
    }
  },
  //计算观看视频广告次数
  check_v() {
    var that = this;
    var day = common.day();
    db.collection('s_history').where({
      name: '观看小视频'
    }).count({
      success(e) {
        console.log(e)
          that.setData({
            count_v: e.total
          })
      }
    })
  },
//判断是否跳转昵称
check_q(){
  var that = this;
  var day = common.day();
  db.collection('s_history').where({
   day:day,
   name:'昵称定制'
    }).count({
      success(e) {
        that.setData({
          count_q: e.total
        })
      }
    })
  },

  //判断是否跳转会员
  check_p() {
    var that = this;
    var day = common.day();
    db.collection('s_history').where({
      day: day,
      name: '领取会员'
    }).count({
      success(e) {
        that.setData({
          count_p: e.total
        })
      }
    })
  },


//记录历史记录
history(name,points){
  var that = this;
  var day = common.day();
  var time = common.nowTime();
  db.collection('s_history').add({
    data: {
      day:day,
      time: time,
      name: name,
      points: points
    },
  })
  that.check_q();
  that.check_v();
  that.check_p();
},
  //奖励积分
add(numb) {
    db.collection('points').where({
      _openid: app.globalData.id
    }).get({
      success(e) {
        if (e.data == "") {
          var point = numb;
          db.collection('points').add({
            data: {
              point: point
            },
          })
        } else {
          var _id = e.data[0]._id;//唯一识别字段
          var point = e.data[0].point + numb;
          db.collection('points').doc(_id).update({
            data: {
              point: point
            },
          })
        }
        wx.showToast({
          title: '积分+'+numb,
        });
      }
    })
  },
  //跳转昵称小程序
  nickname: function (e) {
    var that = this;
    wx.navigateToMiniProgram({
      appId: 'wx980ff4007f3d404d',
      path: 'pages/index/index',
      success(res) {
        if (that.data.count_q==0){
          that.add(1);
          that.history('昵称定制', '+1')
        }else{
          wx.showToast({
            title: '今日已领取',
          })
        }
      },
      fail(res) {
        wx.showModal({
          title: '温馨提示',
          content: '中途退出无法获得积分奖励哦',
          success(res) {
            if (res.confirm) {
              that.nickname();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  //跳转会员小程序
  vip: function (e) {
    var that = this;
    wx.navigateToMiniProgram({
      appId: 'wx6113fc12456e15f2',
      path: 'pages/index/index',
      success(res) {
        if (that.data.count_p == 0) {
          that.add(1);
          that.history('领取会员', '+1')
        } else {
          wx.showToast({
            title: '今日已领取',
          })
        }
      },
      fail(res) {
        wx.showModal({
          title: '温馨提示',
          content: '中途退出无法获得积分奖励哦',
          success(res) {
            if (res.confirm) {
              that.vip();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
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