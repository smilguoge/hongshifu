// pages/coupon/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        wx.request({
          url: wx.getStorageSync('config').couponli_url,
          header: wx.getStorageSync('header'),
          data:{
            lng: res.longitude,
            lat: res.latitude
          },
          success(res){
            console.log(res)
            if(res.data.code==200){
              console.log(res.data.data.bg_url)
              console.log(res.data.data.start_at)
              that.setData({
                bgimages: res.data.data.bg_url,

                begintime: res.data.data.start_at,
                endtime: res.data.data.end_at,
                name: res.data.data.rule_name, 
                themecontent: res.data.data.remark,
                activeid: res.data.data.id
              })

            }else if(res.data.code==500){

            }else{
              wx.showToast({
                title: '请重新再进入！',
                icon: 'error',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  checktel: function (e) {
    this.setData({
      tel: e.detail.value
    })
    console.log(this.data.tel)
  },
  getcoupon:function(){
    const that = this;
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.data.tel))) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'error',
        duration: 2000
      })
      }else{
        wx.request({
          url: wx.getStorageSync('config').couponob_url,
          header: wx.getStorageSync('header'),
          data:{
            id: that.data.activeid,
            mobile:that.data.tel
          },
          method:"post",
          success(res){
            console.log('that.data.activeid')
            console.log(that.data.activeid)
            console.log(that.data.tel)
            if(res.data.code==200){
              wx.showToast({
                title: '领取成功！',
                icon: 'succes',
                duration: 2000
              })
              that.onLoad();

            } else if (res.data.code == 422){
              console.log(that.data.tel)
              wx.showToast({
                title: '领取过了！',
                icon: 'succes',
                duration: 2000
              })
            }else{
              wx.showToast({
                title: '领取失败！',
                icon: 'error',
                duration: 2000
              })
            }


            },
          fail(){
            wx.showToast({
              title: '领取失败！',
              icon: 'error',
              duration: 2000
            })
          }

          
          

        })

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