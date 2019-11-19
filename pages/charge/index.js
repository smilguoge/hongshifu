// pages/charge/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: ['35', "3502", "350203"],
    data: [],
    cityVal: "",
    order_address: '福建省厦门市思明区软件园二期',
    order_lng: '118.08948',
    order_lat: '24.47951',
    regName: "厦门市思明区",
    bgShow: false,
    regId: "",
    cityLaber: "",
    loading: false,
    priceList: "",
    priceShow: true,
    nopriceShow: false,
    remarks: "",
    province: '',
    city: '',
    district: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          myLatitude: res.latitude,
          myLongitude: res.longitude
        });
      }
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