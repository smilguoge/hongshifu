//index.js
//获取应用实例
const app = getApp()
// 引入SDK核心类
var QQMapWX = require('../libs/qqmap-wx-jssdk.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'YGSBZ-QANC4-M2YUA-X2HI3-5AT6Q-JEBIJ' // 必填
});
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    currentindex: 0,
    navbar: ["叫代驾", "代叫"],
    staraddr: '',
    tel: '',
    openid: '',
    longitude: '',
    latitude: '',
    myLatitude: 0.0,
    myLongitude: 0.0,

  },
  currentTab: function (e) {
    if (this.data.currentindex == e.currentTarget.dataset.indx) {
      return;
    }
    this.setData({
      currentindex: e.currentTarget.dataset.indx
    })
  },
  gotomy: function () {
    wx.navigateTo({
      url: '/pages/my/index' // 跳转到新页面
    })
  },
  onShow:function(){  
    console.log(wx.getStorageSync('session').openid)
    // this.getdriverlist()

  },
  onLoad: function () {
    let that = this;
    console.log(wx.getStorageSync('token'))
    /**
     * 实例化API核心类(详情见申请key)：http://lbs.qq.com/console/mykey.html
     */
    qqmapsdk = new QQMapWX({
      /**
       * 严重注意!!!!要申请key以及导入qqmap-wx-jssdk.js，具体见上面的网址
       */
      key: 'YGSBZ-QANC4-M2YUA-X2HI3-5AT6Q-JEBIJ' //XXXX-XXXX-XXXX-XXXX
    });

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
        } else {
          that.setData({
            isHide: true
          });
        }
      }
    });
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          myLatitude: res.latitude,
          myLongitude: res.longitude
        });
      }
    })
    that.setData({
      openid: wx.getStorageSync('session').openid,
      token: wx.getStorageSync('token').access_token
    })

  },
  subdrive1: function () {
    const that = this;
    console.log(that.data.token)
    console.log('that.data.token')
    if(!that.data.token){
      wx.showToast({
        title: '请登录！',
        icon: 'error',
        duration: 2000
      })
      wx.navigateTo({
        url: '/pages/denglu/index',
      })

    }else{
      wx.request({
        url: wx.getStorageSync('config').order_url,
        data: {
          order_address: that.data.staraddr,
          order_lng: that.data.myLongitude,
          order_lat: that.data.myLatitude,
          order_destination_address: '',
          order_destination_lng: '',
          order_destination_lat: '',
          token: that.data.token
        },
        header: wx.getStorageSync('header'),
        method: "post",
        success(res) {
          wx.navigateTo({
            url: '/pages/order/index',
          })
        },
        fail() {
          wx.showToast({
            title: '预约代驾失败',
            icon: 'error',
            duration: 2000
          })
        }

      })

    }
  },
  subdrive2: function () {
    const that = this;
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.data.tel))) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'error',
        duration: 2000
      })
    } else {
      wx.request({
        url: wx.getStorageSync('config').isregister_url,
        data: {
          mp_openid: that.data.openid,
          token: that.data.token,
        },
        header: wx.getStorageSync('header'),
        success(res) {
          if (res.data.code === 200){
            wx.request({
              url: wx.getStorageSync('config').calling_url,
              data: {
                order_address: that.data.staraddr,
                order_lng: that.data.myLongitude,
                order_lat: that.data.myLatitude,
                token: that.data.token,
              },
              header: wx.getStorageSync('header'),
              method: 'post',
              success(res) {
                wx.showToast({
                  title: '预约代叫成功',
                  icon: 'success',
                  duration: 2000
                })

              },
              fail() {
                wx.showToast({
                  title: '预约代驾失败',
                  icon: 'error',
                  duration: 2000
                })

              }
            })
          } else if(res.data.code === 422) {
            wx.navigateTo({
              url: '/pages/registe/index',
            })
          } else if (res.data.code === 401) {
            wx.navigateTo({
              url: '/pages/denglu/index',
            })

          }
        }

      })
    }
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      app.globalData.userInfo = e.detail.userInfo;

      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  checktel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLngLat()
  },
  /**
   * 获取中间点的经纬度，并mark出来
   */
  getdriverlist(lng = this.data.longitude, lat = this.data.longitude){
    const that=this;
    wx.request({
      url: wx.getStorageSync('config').driverlist_url,
      data:{
        order_lng: that.data.longitude,
        order_lat: that.data.latitude, 
      },
      header: wx.getStorageSync('header'),
      success(res){
        console.log(res.data.code)
        if (res.data.code===200){
          if (res.data.data.total>0){
            let drivers = res.data.data.list
            let driversmap=that.data.markers
            drivers=drivers.map(function (driver,index){
              return {
                iconPath: "../../images/marker.png",
                longitude: driver.lng,
                latitude: driver.lat,
                width: 30,
                height: 30,
                id:index++
              }
            })
            let driverss = [ ...drivers]
            console.log(driverss)
            that.setData({
              markers: driverss
            })
            
          

          }
        }
      },
      fail(){}

    })

  },
  getLngLat() {
    const that = this;
    that.mapCtx = wx.createMapContext("map");
    that.mapCtx.getCenterLocation({
      success: function (res) {
        that.setData({
          // markers: [{
          //   id: 0,
          //   iconPath: "../../images/marker.png",
          //   longitude: res.longitude,
          //   latitude: res.latitude,
          //   width: 30,
          //   height: 30
          // }],
          longitude: res.longitude,
          latitude: res.latitude
        })
        that.getPoiList(res.longitude, res.latitude)
        that.getdriverlist(res.longitude, res.latitude)

      }
    })
  },
  /**
   * 视野发生变化时触发：见页面bindregionchange事件
   */
  regionchange(e) {
    e.type == 'end' ? this.getLngLat() : this.getLngLat()
  },
  /**
   * 详情见官方API配置:http://lbs.qq.com/qqmap_wx_jssdk/method-reverseGeocoder.html
   */
  getPoiList(longitude, latitude) {
    let that = this
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      get_poi: 1,
      poi_options: 'policy=2;radius=3000;page_size=2;page_index=1',
      success: function (res) {
        /**
         * 详细数据从这儿拿....
         */
        that.setData({
          staraddr: res.result.pois[0].title
        });
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {

      }
    });
  }
})

