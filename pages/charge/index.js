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
    address:'福建厦门',
    thisSheng: 0,
    multiIndex: [0, 0, 0],
    iscontentture: true
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
    this.setData({
      multiArray: [sheng, shi, qu]
    });

  },
  getpriceinfo() {
    const that = this
    wx.request({
      url: wx.getStorageSync('config').charstan_url,
      data: {
        id: that.data.code
      },
      header: wx.getStorageSync('header'),
      success(res) {
        if (res.data.code == 200) {
          console.log(res)
          console.log(res.data.data.chargeStandard[0].standard[0])
          console.log(res.data.data.chargeStandard[0].standard)
          const data = res.data.data.chargeStandard[0].standard
          console.log(data)
          that.setData({
            iscontentture:true, 
            pricedata: data        
          })

        } else if (res.data.code == 422) {
          that.setData({
            iscontentture: false
          })
          console.log('没有开通')
        } else {

        }

      }
    })
  },
  onLoad: function (options) {
    const that = this
    wx.request({
      url: wx.getStorageSync('config').reglist_url,
      header: wx.getStorageSync('header'),
      success(res) {
        console.log(res.data.data)
        that.setData({
          ssl: res.data.data
        })
        that.getlist()
        console.log(res.data.data)
        wx.getLocation({
           type: 'gcj02',
          success: function (res) {
            that.getDistrict(res.latitude, res.longitude)
            console.log(res.longitude)
            console.log('金纬度')
          }
        })
      }
    })

  },
  getDistrict(latitude, longitude) {
    const that = this;
    var data = this.data.ssl;
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${keys}`,
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {   
        console.log('that.data.multiArray')     
        const city = res.data.result.ad_info.name.substring(3).split(',')
        let citystring = city[1] + city[2]
        console.log(that.data.ssl)
        let shengcode = that.data.ssl.findIndex(function (item) {
          return item.label == city[0];
        })

        let shicode = that.data.ssl[shengcode].children.findIndex(function (item) {
          return item.label == city[1];
        })

        let qucode = that.data.ssl[shengcode].children[shicode].children.findIndex(function (item) {
          return item.label == city[2];
        })
     

        let multiArrayy1 = 'multiArray[' + 1 + ']', multiArrayy2 = 'multiArray[' + 2 + ']';
        var shiarray = [], quarray = [];

        console.log(data[shengcode].children[shicode].children)
        console.log('shiarray')
        console.log(data[shengcode].children)
        for (let ele of data[shengcode].children){
          console.log(ele)
          console.log('1133')
          shiarray.push(ele.label)
          console.log(ele.label)
        }
        for (let ele of data[shengcode].children[shicode].children) {
          console.log('111')
          quarray.push(ele.label)
        }


        // for (let ele of data[shengcode].children.values()) {
        //   console.log('3333')
        //   shiarray.push(ele.label)
        // }
        // console.log(shiarray)
   

        // console.log('222')
        // for (let ele of data[shengcode].children[shicode].children.values()) {
        //   console.log('111')
        //   quarray.push(ele.label)
        // }
        that.setData({
          code: res.data.result.ad_info.adcode,
          [multiArrayy1]: shiarray,
          [multiArrayy2]: quarray,
          multiIndex: [shengcode, shicode, qucode],
          thisSheng: shengcode,
          address: res.data.result.address,
          addressqu: citystring
        })
        that.getpriceinfo()
      }
    })

  },
  bindMultiPickerChange: function (e) {
    let [sheng, shi, qu] = e.detail.value
    let data = this.data.ssl[sheng].children[shi]
    let citystring = data.label + data.children[qu].label
    this.setData({
      multiIndex: e.detail.value,
      code: data.children[qu].value,
      addressqu: citystring
    })
    this.getpriceinfo()
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