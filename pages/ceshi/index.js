//index.js
//获取应用实例
const app = getApp()
// 引入SDK核心类
var QQMapWX = require('../libs/qqmap-wx-jssdk.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'YGSBZ-QANC4-M2YUA-X2HI3-5AT6Q-JEBIJ' // 必填
});
let keys = 'YGSBZ-QANC4-M2YUA-X2HI3-5AT6Q-JEBIJ'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: ['北京市', '北京市', '东城区'],
    thisSheng: 0,
    multiIndex: [0, 0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getlist() {
    var ssls = this.data.ssl;
    //定义对应变量
    var sheng = [];
    var shi = [];
    var qu = [];
    for (var i in ssls) {
      sheng.push(ssls[i].label)
      if (i == 0) {
        for (var u in ssls[i].children) {
          shi.push(ssls[i].children[u].label)
          for (var j in ssls[i].children[u].children) {
            qu.push(ssls[i].children[u].children[j].label)
          }
        }
      }
    }
    console.log(sheng)
    this.setData({
      multiArray: [sheng, shi, qu]
    });

  },
  onLoad: function (options) {
    const that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.getDistrict(res.latitude, res.longitude)
      }
    })
    wx.request({
      url: wx.getStorageSync('config').reglist_url,
      header: wx.getStorageSync('header'),
      success(res) {
        that.setData({
          ssl: res.data.data
        })
        that.getlist()
      }
    })
  },
  getDistrict(latitude, longitude) {
    const that = this
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${keys}`,
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        console.log(res.data.result)
        const city = res.data.result.ad_info.name.substring(3).split(',')
        // const sheng=[city[0]]
        // const shi = [city[1]]
        // const qu = [city[2]]
        that.setData({
          code: res.data.result.ad_info.adcode,
          //  multiArray: [sheng, shi, qu]
        })
      }
    })

  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        this.setData({
          thisSheng: e.detail.value
        })
        //此处是拖动第一栏的时候处理
        var row = this.getCity(e.detail.value);
        data.multiArray[1] = row[0];
        data.multiArray[2] = row[1];

        //此处默认选中第一项
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        //此处是拖动第二栏的时候处理
        var row = this.getCity(this.data.thisSheng, e.detail.value);
        console.log(row);
        data.multiArray[2] = row[1];
        data.multiIndex[2] = 0;
        console.log(data.multiIndex);
        break;
    }
    this.setData(data);
  },
  getCity: function (x, y = 999, z = 999) {
    console.log("xy", x, y);
    var ssls = this.data.ssl;
    var shi = [];
    var qu = [];
    for (var i in ssls) {
      if (i == x) {
        for (var u in ssls[i].children) {
          shi.push(ssls[i].children[u].label)
          if (u == y) {
            for (var j in ssls[i].children[u].children) {
              qu.push(ssls[i].children[u].children[j].label)
            }
            break;
          }
          if (y == 999) {
            for (var j in ssls[i].children[u].children) {
              qu.push(ssls[i].children[u].children[j].label)
            }
          }

        }
        break;
      }
    }
    console.log(shi);
    return [shi, qu];

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