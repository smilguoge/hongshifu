// pages/registe/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel:'',
    openid:'',

  },
  inputvalue:function(e){
    this.setData({
      tel: e.detail.value
    })

  },
  putregist:function(){
    const that = this;
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.data.tel))) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'error',
        duration: 1500
      })
    }else{
    wx.request({
      url: wx.getStorageSync('config').register_url,
      data:{
        mobile: that.data.tel,
        mp_openid: that.data.openid,
        token: that.data.token       
      },
      method:'post',
      header: wx.getStorageSync('header'),
      success(res){
        if (res.data.code===200){
          wx.showToast({
            title: '申请成功！',
            icon: 'success',
            duration: 1800
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: '失败重新申请！',
            icon: 'error',
            duration: 1800
          })

        }

      }

    })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openid = wx.getStorageSync('session').openid
    let token = wx.getStorageSync('token').access_token
    this.setData({
      openid: openid,
      token: token
    })

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