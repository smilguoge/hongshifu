// pages/order2/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    string1: '评价',
    limit: 8,
    page: 1,
    isshow: true,
    orderinfs:[],
    shownum:0
  },
  goorderinf: function (e) {
    wx.navigateTo({
      url: '/pages/orderinfs/index?id=' + e.currentTarget.dataset.id,
    })
  },
  goassess: function (e) {
    wx.navigateTo({
      url: '/pages/assess/index?id=' + e.currentTarget.dataset.id,
    })
  },
  getorderlist() {
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
        if(res.data.code==200){
          wx.hideToast()
          if (res.data.data.total==0){
           that.setData({
              isshow: false
            }) 
            wx.showToast({
              title: '还没下单过！',
              icon: 'none',
              duration: 2500
            })

          }else{
            if (res.data.data.list.length > 0) {
              let orderinfs = res.data.data.list
              orderinfs.forEach((item) => {
                item.order_at = item.order_at.substring(5, 16)
                if (item.order_destination_address.length > 13) {
                  item.order_destination_address = item.order_destination_address.substring(0, 13) + '...'
                }
              })
              that.setData({
                orderinfs: orderinfs,
                isshow: true,
                total: res.data.data.total
              })

            }

          }

        }else{
          let mess = res.data.message
          wx.showToast({
            title: mess,
            icon: 'none',
            duration: 2500
          })

        }

      }

    })
  },
  getorderlistmore() {
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
        if (res.data.code == 200) {
          wx.hideToast()
          console.log(res.data.data.list)
            if (res.data.data.list.length > 0) {
              let orderinfs = res.data.data.list
              orderinfs.forEach((item) => {
                item.order_at = item.order_at.substring(5, 16)
                if (item.order_destination_address.length > 13) {
                  item.order_destination_address = item.order_destination_address.substring(0, 13) + '...'
                }
              })
              let orderin = [...that.data.orderinfs, ...orderinfs]
              that.setData({
                orderinfs: orderin,
                isshow: true,
                total: res.data.data.total
              })

            }

        

        } else {
          let mess = res.data.message
          wx.showToast({
            title: mess,
            icon: 'none',
            duration: 2500
          })

        }


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
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 900000
    })

  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.shownum)
    if(this.data.shownum==0){
      this.setData({
        shownum:1
      })

    }else{
      this.setData({
        limit: 8,
        page: 1
      })
      this.getorderlist()

    }

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
    console.log("下拉")
    console.log(this.data.total)
    console.log("下拉")
    console.log(this.data.orderinfs.length)
    var that = this;
    if (that.data.orderinfs.length == that.data.total) {
      wx.showToast({
        title: '没有更多',
        icon: 'success',
        duration: 2500
      })

    } else {
      that.setData({
        page: that.data.page + 1
      })
      that.getorderlistmore() //重新加载onLoad()
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 900000
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})