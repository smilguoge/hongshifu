// pages/travel/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    time:'',
    distance:'',
    staaddr: '',
    endaddr: '',
    money: '',
    traveldata:{},
    markers: [{
      iconPath: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMS41NiA0Ni45MiI+PGcgZGF0YS1uYW1lPSLlm77lsYIgMiI+PGcgZGF0YS1uYW1lPSLlm77lsYIgMSI+PHBhdGggZD0iTTMxLjU2IDE1Ljc4YzAgOC43MS0xNS43OCAzMS4xNC0xNS43OCAzMS4xNFMwIDI0LjQ5IDAgMTUuNzhhMTUuNzggMTUuNzggMCAwIDEgMzEuNTYgMHoiIGZpbGw9IiMxNzk3ZTQiLz48dGV4dCB0cmFuc2Zvcm09Im1hdHJpeCguOTMgMCAwIDEgNy42OSAyMi4wMSkiIGZvbnQtc2l6ZT0iMTcuMzIiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJTb3VyY2VIYW5TYW5zQ04tTWVkaXVtLUdCcGMtRVVDLUgsU291cmNlIEhhbiBTYW5zIENOIj7otbc8L3RleHQ+PC9nPjwvZz48L3N2Zz4=",
      id: 0,
      latitude: '',
      longitude: '',
      width: 30,
      height: 30
    },
      {
        iconPath: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMS41NiA0Ni45MiI+PGcgZGF0YS1uYW1lPSLlm77lsYIgMiI+PGcgZGF0YS1uYW1lPSLlm77lsYIgMSI+PHBhdGggZD0iTTMxLjU2IDE1Ljc4YzAgOC43MS0xNS43OCAzMS4xNC0xNS43OCAzMS4xNFMwIDI0LjQ5IDAgMTUuNzhhMTUuNzggMTUuNzggMCAwIDEgMzEuNTYgMHoiIGZpbGw9IiNmZTRhNGMiLz48dGV4dCB0cmFuc2Zvcm09Im1hdHJpeCguOTMgMCAwIDEgNy42OSAyMi4wMSkiIGZvbnQtc2l6ZT0iMTcuMzIiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJTb3VyY2VIYW5TYW5zQ04tTWVkaXVtLUdCcGMtRVVDLUgsU291cmNlIEhhbiBTYW5zIENOIj7nu4g8L3RleHQ+PC9nPjwvZz48L3N2Zz4=",
        id: 1,
        longitude: '',
        latitude: '',
        width: 30,
        height: 30
      }],
    polyline: [{
      points: [{ }],
      color: "#FF0000DD",
      width: 4,
      dottedLine: false
    }],
  },
  goassess:function(){
    wx.navigateTo({
      url: '/pages/assess/index?id=' + this.data.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const token = wx.getStorageSync('token');
    that.setData({id:options.id});
    let markla0 = 'markers[' + 0 + '].latitude', markln0 = 'markers[' + 0 + '].longitude', markla1 = 'markers[' + 1 + '].latitude',  markln1 = 'markers[' + 1 + '].longitude';
    wx.request({
      url: wx.getStorageSync('config').detail_url,
      data: {
         token: token.access_token,
        id: that.data.id
      },
      header: wx.getStorageSync('header'),
      success(res){
        console.log(res.data.data)
        const data = res.data.data
        data.mileage = data.mileage.substring(0, data.mileage.indexOf('.')+2)
        data.money = data.money.substring(0, data.money.indexOf('.'))
        that.setData({
          time: data.driving_minute,
          distance: data.mileage,
          staaddr: data.order_address,
          endaddr: data.order_destination_address,
          money: data.money,
          [markla0]: data.order_lat,
          [markln0]: data.order_lng,
          [markla1]: data.destination_lat,
          [markln1]: data.destination_lng,
        })
        

      }
    })
    wx.request({
      url: wx.getStorageSync('config').tracker_url,
      data: {
        token: token.access_token,
        id: that.data.id
      },
      header: wx.getStorageSync('header'),
      success(res) {
        let data = res.data.data.points;
        let points=[];
        let opp = 'polyline[' + 0 + '].points'
        if (data.length>0){
          data.forEach(r => {
            let num = r.location.indexOf(',')
            let ln = r.location.substring(0, num), la = r.location.substring(num + 1);
            const laln = {
              longitude: ln,
              latitude: la
            }
            points.push(laln)
          })
          that.setData({
            [opp]: points
          })
        }
        
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