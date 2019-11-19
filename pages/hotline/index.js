// pages/hotline/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    endtitle:'我是有底线',
    companyinf:[],
    page:1,
    limit:15,
    name:"",
    reachbottom:true
  },
  tel(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  searchcompany(){
    this.getcompany()
  },
  getcompany(){
    const that=this
    wx.request({
      url: wx.getStorageSync('config').hotline_url,
      data: {
        name: that.data.name,
        page: that.data.page,
        limit: that.data.limit,
      },
      header: wx.getStorageSync('header'),
      success(res){  
        if (res.data.code == 200 && res.data.data.list.length > 0){
          console.log(res.data.data.list)
          if (that.data.reachbottom){
            that.setData({
              companyinf: res.data.data.list,
               reachbottom: true
            })
          }else{
            const list = [...that.data.companyinf, ...res.data.data.list]
            that.setData({
              companyinf: list,
              reachbottom: true
            })           

          }
                   
        } else if (res.data.data.list.length == 0){
          wx.showToast({
            title: "没有更多！",
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: "返回重新刷新！",
            icon: 'error',
            duration: 2000
          })  
        }

      },
      fail(){
        wx.showToast({
          title: "返回重新刷新！",
          icon: 'error',
          duration: 2000
        })  
      }   
    })
  },
  
  getcompanyname(e){
    this.setData({
      name: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getcompany()
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
    this.setData({
      page: this.data.page + 1 ,
      reachbottom:false
    })
    this.getcompany()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})