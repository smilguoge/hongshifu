// pages/denglu/index.
const app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobile:'',
    smsvcode:'',
    platform:'mini_program',
    openid:'',
    disable:false,
    codename:'获取验证码', 
    hiddentel:true,
  },
  gettel:function(){
    this.setData({
      hiddentel: false
    })
  },
  rejecttel:function(){
    this.setData({
      hiddentel: true
    })
  },
 checktel: function () {
    this.setData({
      hiddentel: true
    })
  },
  getPhoneNumber: function (e) {
    var that = this
    let tel = wx.getStorageSync('phone')
    if (!tel){
      wx.request({
        url: wx.getStorageSync('config').userinfo_url,
        data: {
          sessionKey: wx.getStorageSync('session').session_key,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        },
        header: { 'x-service-id': '1' },
        success(res) {
          wx.setStorageSync('phone', res.data.data.phoneNumber);
          wx.request({
            url: wx.getStorageSync('config').senduser_url,
            data: {
              openid: wx.getStorageSync('session').openid,
              platform: 'mini_program,',
              phone: res.data.data.phoneNumber,
              service_id: '1'
            },
            method: 'post',
            header: { 'x-service-id': '1' },
            success(res) {
              wx.request({
                url: wx.getStorageSync('config').quick_login_url,
                data: {
                  openid: wx.getStorageSync('session').openid,
                  platform: 'mini_program,'
                },
                method: 'post',
                header: { 'x-service-id': '1' },
                success(res) {
                  wx.setStorageSync('token', res.data.data);//存储token
                  let createTime = new Date();
                  wx.setStorageSync('createTime', createTime);
                  wx.redirectTo({
                    url: '/pages/index/index',
                  })
                }
              })


            }
          })
        }
      })

    }else{
      wx.request({
        url: wx.getStorageSync('config').quick_login_url,
        data: {
          openid: wx.getStorageSync('session').openid,
          platform: 'mini_program,'
        },
        method: 'post',
        header: { 'x-service-id': '1' },
        success(res) {
          wx.setStorageSync('token', res.data.data);//存储token
          let createTime = new Date();
          wx.setStorageSync('createTime', createTime);
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
      })


    }






  },
  putlogin: function () {
    const that=this;
    wx.request({
      url: wx.getStorageSync('config').login_url,
      data:{
        mobile: that.data.mobile,
        smsvcode: that.data.smsvcode,
        platform: that.data.platform,
        openid: that.data.openid,
      },
    method: "post",
    header: { 'x-service-id': '1' },
    success(res){
      if (res.data.code == 200){
        let token = res.data.data;
        wx.setStorageSync('token', token);//存储token
        let createTime = new Date();
        wx.setStorageSync('createTime', createTime);
        wx.redirectTo({
          url: '/pages/index/index',
        })
      } else if (res.data.code == 422){
        wx.showToast({
          title: '验证码错误',
          icon: 'error',
          duration: 2000
        })
      }else{
        wx.showToast({
          title: '请重新获取登录！',
          icon: 'error',
          duration: 2000
        })
      }
    },
    fail() {
    }
  })
    },
  inputvalue:function(e){
    this.setData({
      mobile: e.detail.value
    })   
  },
  checkinput: function (e) {
    this.setData({
      smsvcode: e.detail.value
    })
  },
  getcheck: function (e) {
    let that=this;
    var num = 60,timer;
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.data.mobile))) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'error',
        duration: 2000
      })
    } else{
      that.setData({
        codenum: num
      })
       wx.request({
          url: wx.getStorageSync('config').send_url,
          method:'post',
          data:{
            type: 'login',
            mobile:that.data.mobile            
          },
         header: { 'x-service-id': '1' },
          success(res){
           timer=setInterval(function(){
             num--;
             if(num<=0){
               clearInterval(timer);
               that.setData({
                 codename:'重新发送',
                 disable:false,
               })
             }else{
               that.setData({
                 codename:num + 's',
                 disable:true
               })

             }
           }, 1000)
          }
        })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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
    const that = this;
    that.setData({
      openid: wx.getStorageSync('session').openid
    })

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