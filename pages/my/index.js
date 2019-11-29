// pages/my/index.js
const app = getApp()
var QQMapWX = require('../libs/qqmap-wx-jssdk.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'YGSBZ-QANC4-M2YUA-X2HI3-5AT6Q-JEBIJ' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    tel:'',
    money:'0',
    integral:'0',
    customerlogo:'',
    state:'登录',
    statenum:true,
  },
  getorder:function(){
    let token = wx.getStorageSync('token');
    let time = new Date();
    let createTime = wx.getStorageSync('createTime');
    if (token && !(time - createTime > 14 * 24 * 3600 * 1000)){
      wx.navigateTo({
        url: '/pages/order/index',
      })
    }else{
      wx.redirectTo({
        url: '/pages/denglu/index',
      })
    }

  },
  gocharge: function () {
    let token = wx.getStorageSync('token');
    let time = new Date();
    let createTime = wx.getStorageSync('createTime');
    if (token && !(time - createTime > 14 * 24 * 3600 * 1000)) {
      wx.navigateTo({
        url: '/pages/charge/index',
      })
    } else {
      wx.redirectTo({
        url: '/pages/denglu/index',
      })
    }

  },
  gohotline: function () {
    let token = wx.getStorageSync('token');
    let time = new Date();
    let createTime = wx.getStorageSync('createTime');
    if (token && !(time - createTime > 14 * 24 * 3600 * 1000)) {
      wx.navigateTo({
        url: '/pages/hotline/index',
      })
    } else {
      wx.redirectTo({
        url: '/pages/denglu/index',
      })
    }

  },
  gocoupon: function () {
    let token = wx.getStorageSync('token');
    let time = new Date();
    let createTime = wx.getStorageSync('createTime');
    if (token && !(time - createTime > 14 * 24 * 3600 * 1000)) {
      wx.navigateTo({
        url: '/pages/coupon/index',
      })
    } else {
      wx.redirectTo({
        url: '/pages/denglu/index',
      })
    }

  },
  goagreement: function () {
      wx.navigateTo({
        url: '/pages/agreement/index',
      })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const token = wx.getStorageSync('token');
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        // that.setData({
        //   longitude: res.longitude,
        //   latitude: res.latitude
        // });
        wx.request({
          url: wx.getStorageSync('config').couponli_url,
          data: {
            lng: res.longitude,
            lat: res.latitude
      },
          header: wx.getStorageSync('header'),
          success(res) {
            console.log(res)
            if (res.data.code == 422){
              console.log("ddd")
              that.setData({
                ishidden:true
              })
              console.log(that.data.ishidden)
            }
          }
        })

      }
    })
    if (token){
       wx.request({
         url: wx.getStorageSync('config').info_url,
         data: {
           token: token.access_token
         },
         header: wx.getStorageSync('header'),
        success(res) {
             console.log(wx.getStorageSync('token'))
             that.setData({
               customerlogo: app.globalData.userInfo.avatarUrl,
               name: res.data.data.realname,
               tel: res.data.data.mobile,
               state: "退出",
               statenum: false,
             })
          
         }
       })

     }else{
      that.setData({
        customerlogo: '../../images/customlogo.png'
      })
       wx.showToast({
         title: '请登录！',
         icon: 'error',
         duration: 2000
       })
     }
  },
  escprogram:function(){
    const that=this;
    let token = wx.getStorageSync('token');
    if (that.data.statenum){
      wx.redirectTo({
        url: '/pages/denglu/index',
      })
    } else{
       wx.request({
         url: wx.getStorageSync('config').logout_url,
         data: {
           token: token.access_token
         },
         header: wx.getStorageSync('header'),
         success(res) {
           wx.removeStorageSync('token')
           that.setData({
            state: '登录',
            statenum: false,
            name: '',
            tel: '',
            money: '0',
            integral: '0',
            customerlogo: '../../images/customlogo.png',
           })
           wx.redirectTo({
            url: '/pages/index/index',
           })
         }
      })


      // wx.setStorageSync('token','')
      // that.setData({
      //   state: '登录',
      //   statenum: false,
      //   name: '',
      //   tel: '',
      //   money: '0',
      //   integral: '0',
      //   customerlogo: '../../images/customlogo.png',
      // })
      // wx.navigateTo({
      //   url: '/pages/index/index',
      // })

      // wx.request({
      //   url: that.data.config.logout_url,
      //   data: {
      //     token: token.access_token
      //   },
      //   header: wx.getStorageSync('header'),
      //   success(res) {
      //     wx.clearStorageSync('token')
      //     that.setData({
      //       state: '登录',
      //       statenum: false,
      //       name: '',
      //       tel: '',
      //       money: '0',
      //       integral: '0',
      //       customerlogo: '../../images/customlogo.png',
      //     })
      //     wx.navigateTo({
      //       url: '/pages/index/index',
      //     })
      //   }
      // })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})