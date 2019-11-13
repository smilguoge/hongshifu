// pages/order/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    customerlogo: '',
    orderinf:{},
    staaddr:'',
    endaddr:'',
    money:'',
    isorderstat:'',
    continf:'',
    isordershow:true,
    orderitems:[],
    isshow:false,
    assshow: false,
    index:'',
    content:'请选择',
    reason:''
  },
  gopath:function(e){
    const that = this;
    wx.navigateTo({
      url: '/pages/travel/index?id=' + that.data.id, 
    })
  },
  cancelorder:function(){
    this.setData({
      isordershow: !this.data.isordershow,
    });

  },
  putmessage:function(){
    const that=this;
    const token = wx.getStorageSync('token');
    this.setData({
      isordershow: !this.data.isordershow,
    });
    let page=getCurrentPages();
    wx.request({
      url: wx.getStorageSync('config').cancel_url,
      data:{
        id:that.data.id,
        cancel_item: that.data.content,
        cancel_reason:that.data.reason,
        token: token.access_token,
      },
      method:'post',
      header: wx.getStorageSync('header'),
      success(){
        getCurrentPages()[getCurrentPages().length - 1].onLoad()
        wx.showToast({
          title: '取消成功！',
          icon: 'success',
          duration: 2000
        })

      }

    })


  },
  messgeboxshow:function(){
    this.setData({
      isordershow: !this.data.isordershow,
    });
  },
  // 点击下拉显示框
  selectTap: function () {
    this.setData({
      isshow: !this.data.isshow,
    });
  },
  // 点击下拉列表
  optionTap: function (e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    let content = e.currentTarget.dataset.value;
    this.setData({
      index: Index,
      isshow: !this.data.isshow,
      content: content,
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this;
    const token = wx.getStorageSync('token');
    let staradds,endadds;
    wx.request({
      url: wx.getStorageSync('config').item_url,
      data:{pid:'ORDER_EVALUATE' },
      success(res){
        that.setData({ orderitems: res.data.data})
      }
    })
    wx.request({
      url: wx.getStorageSync('config').detail_url,
      data: {
        token: token.access_token,
        id:that.options.id
      },
      header: wx.getStorageSync('header'),
      success(res){
        console.log(res)
        console.log(res.data.data.order_address.length > 12)
        if (res.data.data.avatar_url){
            that.setData({customerlogo: res.data.data.avatar_url})
        }else{
          that.setData({customerlogo: app.globalData.userInfo.avatarUrl})
            }
        if (res.data.data.status==0){
          that.setData({ isorderstat: true })
        }else{
          that.setData({ isorderstat: false })
        }
        if (res.data.data.status == 60) {
          that.setData({ assshow: true })
        }
        if (res.data.data.order_address.length > 12){
             staradds=res.data.data.order_address.substring(0, 12) + '...'
        }else{
           staradds = res.data.data.order_address
        }
        if (res.data.data.order_destination_address.length > 12) {
          endadds=res.data.data.order_destination_address.substring(0, 12) + '...'
        }else{
          endadds = res.data.data.order_destination_address
        }      
        that.setData({
            orderinf: res.data.data,
            id: that.options.id,
            staaddr: staradds,
            endaddr: endadds,
            money: res.data.data.money,
            status: res.data.data.status,
            drivtime: res.data.data.driving_minute,
            mileage: res.data.data.mileage,
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