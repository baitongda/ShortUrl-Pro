import Dialog from '../../dist/dialog/dialog';
var  app = getApp();
var common = require("../../common.js");
var db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
 urls:"",
 list:""
  },
//页面启动
  onLoad: function (options) {
    this.sid();
    this.history();
  },
onShow(){
  this.getboard();
},
  //获取剪切板
  getboard: function () {
    var that = this;
    wx.getClipboardData({
      success: function (res) {
        if (res.data == that.data.urls) {
          console.log("重复剪切板")
        } else {
          var text = res.data.indexOf("http");
          if (text != "-1") {
            wx.showModal({
              title: '已捕捉到剪贴板内容',
              content: res.data,
              confirmText:'粘贴',
              success(e) {
                if (e.confirm) {
                  that.setData({
                   urls: res.data,
                  })
                } else if (e.cancel) {
                  console.log('点击取消')
                }
              }
            })
          } else {
            console.log("剪切板无")
          }
        }
      }
    })
  },

  //从本地存储获取openid
  sid(){
    var id = wx.getStorageSync('id');
    if (id==""){
      this.getid();
    }else{
      app.globalData.id = id;
    }
  },
  // 获取用户openid
  getid() {
    var that = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        wx.setStorage({
          key: "id",
          data: res.result.openid
        })
        app.globalData.id = res.result.openid;
        that.setData({
          id: res.result.openid
        })
      }
    })
  },
//获取输入内容
inPut(e){
this.data.urls = e.detail.value;
},
//清空记录
clear(){
  this.setData({urls:"",list:""});
},
//校检
check(){
  var that = this;
  if (!(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(that.data.urls))) {
    wx.showToast({
      title: '网址输入错误',
      duration: 2000,
      icon: 'none'
    });
    return false;
  }
that.points();
},
//积分计算
  points() {
    var that = this;
    db.collection('points').where({
      _openid: app.globalData.id
    }).get({
      success(e) {
        if (e.data == '' ||e.data[0].point<2) {
          Dialog.confirm({
            title: '温馨提示',
            closeOnClickOverlay: true,
            messageAlign: 'center',
            message: "积分不足，请先领取积分",
            confirmButtonText: '领取',
            transition: 'fade',
          }).then(() => {
          wx.switchTab({
            url: '/pages/points/points',
          })
          }).catch(() => {
            console.log('不复制')
          });
        } else {
              var _id = e.data[0]._id;//唯一识别字段
               var point = e.data[0].point -2;
                db.collection('points').doc(_id).update({
                  data: {
                    point: point
                  },
                complete(e){
                  wx.showToast({
                    title: '积分-2',
                  });
                  that.s_history();
                 that.change();
                }
                });
            }
            }
          })
  },
  //记录历史记录
  s_history() {
    var that = this;
    var day = common.day();
    var time = common.nowTime();
    db.collection('s_history').add({
      data: {
        day: day,
        time: time,
        name: '生成短网址',
        points: '-2'
      },
      success(e){
       
      }
    })
  },

//生成短网址
change(){
  this.data.List = new Array();
  this.short('wx');//微信短网址
  this.short('sina');//新浪短网址
  this.short('baidu');//百度短网址
  this.short('im');
  this.short('u3v');
  this.short('mrw');
  this.add();//添加历史记录
},
  //获取短网址
 short(e) {
    var that = this;
    var item = { url: "", name: "", };
    var List = that.data.List;
    var url = app.url+e+"_short.php?" + that.data.urls;
    common.get(url).then((res) => {
     var url = res.data.url;
     if (url!==null&&url!==undefined){
      item.url = url;
      item.name = res.data.name;
      List.push(item);
      that.setData({
        list:List
      })
     }
    })
  },
  //添加到历史记录
add(){
  var that = this;
  var time = common.nowTime();
  db.collection('history').add({
    data: {
      time: time,
      url: that.data.urls,
    },
    success (res) {
     that.history();
    },
  })
},
//查询历史记录
history(){
  var that = this;
  db.collection('history').where({
    _openid: app.globalData.id
  }).orderBy('time', 'desc').limit(6)
 .get({
      success(e){
       that.setData({
         his: e.data
        });
      }
    })
},
//点击复制短链接
copy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.copy,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  },
//点击历史记录弹窗
url(e){
  var url = e.currentTarget.dataset.url;
  Dialog.confirm({
    title: '长链接',
    closeOnClickOverlay:true,
    messageAlign:'left',
    message: url,
    confirmButtonText:'复制',
    transition:'fade',
  }).then(() => {
    wx.setClipboardData({
      data: url,
      success: res => {
        wx.showToast({
          title: '已复制链接',
          duration: 1000,
        })
      }
    })
  }).catch(() => {
    console.log('不复制')
  });
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