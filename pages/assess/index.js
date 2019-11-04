// pages/assess/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 5,//后端给的分数,显示相应的星星
    one_1: '',
    two_1: '',
    one_2: 5,
    two_2: 0,
    evaluate:'',
    id:'',
    reason: '', 
    starinf:{},
    items:null,
  },
  checkChange: function (e) {
    var that = this
    that.setData({
      value: e.detail.value
    })
    var items = this.data.items;
    var checkArr = e.detail.value;
    for (var i = 0; i < items.length; i++) {
      var string1 = items[i].key;
      if (checkArr.indexOf(string1) != -1) {
        items[i].checked = true;
      } else {
        items[i].checked = false;
      }
    }
    this.setData({
      items: items
    })
  },
  in_xin: function (e) {
    var in_xin = e.currentTarget.dataset.in;
    var one_2;
    if (in_xin === 'use_sc2') {
      one_2 = Number(e.currentTarget.id);
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.one_2;
    }
    this.setData({
      one_2: one_2,
      two_2: 5 - one_2,
      items: this.data.starinf.slice(0, one_2 + 2),
    })
  }
,
  putassess:function(){
    const that = this;
    const token = wx.getStorageSync('token');
    const items = that.data.items;
    for (var i = 0; i < items.length; i++) {
      if (items[i].checked) {
        that.setData({
          evaluate: that.data.evaluate + items[i].value + ','
        })

      } }
    wx.request({
      url: wx.getStorageSync('config').evaluate_url,
      data: {
        token: token.access_token,
        id: that.data.id,
        star: that.data.one_2,
        evaluate_item:that.data.evaluate,
        evaluate_reason: that.data.reason,
      },
      method:'post',
      header: { 'x-service-id': '1' },
      success(res){
        wx.navigateBack();
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    wx.request({
      url: wx.getStorageSync('config').item_url,
      data:{pid:'ORDER_EVALUATE'},
      header: { 'x-service-id': '1' },
      success(res){
        that.setData({
          items: res.data.data,
          starinf: res.data.data,
          one_1: that.data.num,
          two_1: 5 - that.data.num,
          id: that.options.id,
        })

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