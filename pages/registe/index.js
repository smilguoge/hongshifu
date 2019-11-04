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
    let token = wx.getStorageSync('token').token
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
        openid: that.data.openid,
        token: token       
      },
      method:'post',
      header: { 'x-service-id': '1' },
      success(res){
        wx.navigateBack({
          delta:1 
        })

      }

    })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openid=wx.getStorageSync('session')
    this.setData({
      openid: openid
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