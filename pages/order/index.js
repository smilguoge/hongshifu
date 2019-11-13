// pages/order2/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    string1:'评价',
    orderinfs:{},
    limit:4,
    pages:1
  },
  goorderinf:function(e){
    wx.navigateTo({
      url: '/pages/orderinfs/index?id=' + e.currentTarget.dataset.id,
    })
  },
  goassess:function(e){
    wx.navigateTo({
      url: '/pages/assess/index?id=' + e.currentTarget.dataset.id,
    })
  },
  getorderlist(){
    const that = this;
    const token = wx.getStorageSync('token');
    const orderinfs = [];
    wx.request({
      url: wx.getStorageSync('config').list_url,
      data: {
        token: token.access_token,
        page: that.data.page,
        limit: that.data.limit
      },
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res.data.data.list)
        let orderinfs = res.data.data.list
        if (orderinfs.length>0){
          orderinfs.forEach((item) => {
            item.order_at = item.order_at.substring(5, 16)
            if (item.order_destination_address.length > 13) {
              item.order_destination_address = item.order_destination_address.substring(0, 13) + '...'
            }
          })
        }

        that.setData({
          orderinfs: orderinfs
        })


      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getorderlist()
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

    this.getorderlist()

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
    var that = this;
    that.setData({
      limit: that.data.limit + 4
    })
    that.onLoad(); //重新加载onLoad()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})