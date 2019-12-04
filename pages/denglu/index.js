// pages/denglu/index.
const app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    mobile:'',
    smsvcode:'',
    platform:'mini_program',
    openid:'',
    disable:false,
    codename:'获取验证码', 
    hiddentel:true,
  },
  gettel:function(){
    this.setData({
      hiddentel: false
    })
  },
  rejecttel:function(){
    this.setData({
      hiddentel: true
    })
  },
 checktel: function () {
    this.setData({
      hiddentel: true
    })
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
  getPhoneNumber: function (e) {
    var that = this
    let tel = wx.getStorageSync('phone')
    console.log(tel) 
    if (!tel){
      wx.request({
        url: wx.getStorageSync('config').userinfo_url,
        data: {
          sessionKey: wx.getStorageSync('session').session_key,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        },
        header: wx.getStorageSync('header'),
        success(res) {
          console.log(res)
          console.log("获取电话成功")
          console.log(wx.getStorageSync('session').openid)
          if(res.data.code==200){
          wx.setStorageSync('phone', res.data.data.phoneNumber);
            wx.request({
              url: wx.getStorageSync('config').login_url,
              data: {
                openid: wx.getStorageSync('session').openid,
                platform: 'mini_program',
                mobile: res.data.data.phoneNumber,
                smsvcode:'2456'
              },
              method: 'post',
              header: wx.getStorageSync('header'),
              success(res) {
                console.log()
                console.log(res.data.data)
                console.log(res.data.code)
                console.log("获取token")
                if (res.data.code == 200) {
                  wx.setStorageSync('token', res.data.data);//存储token
                  let createTime = new Date();
                  wx.setStorageSync('createTime', createTime);
                  wx.redirectTo({
                    url: '/pages/index/index',
                  })
                } else {
                  let mess = res.data.message
                  wx.showToast({
                    title: mess,
                    icon: 'none',
                    duration: 2000
                  })

                }
              }
            })
          }else{
            let mess = res.data.message
            wx.showToast({
              title: mess,
              icon: 'none',
              duration: 2000
            })

          }
        }
      })

    }else{
      wx.request({
        url: wx.getStorageSync('config').login_url,
        data: {
          openid: wx.getStorageSync('session').openid,
          platform: 'mini_program',
          mobile: tel,
          smsvcode: '2456'
        },
        method: 'post',
        header: wx.getStorageSync('header'),
        success(res) {
          console.log(res)
          if (res.data.code == 200) {
            wx.setStorageSync('token', res.data.data);//存储token
            let createTime = new Date();
            wx.setStorageSync('createTime', createTime);
            wx.redirectTo({
              url: '/pages/index/index',
            })
          } else {
            let mess = res.data.message
            wx.showToast({
              title: mess,
              icon: 'none',
              duration: 2000
            })

          }
        }
      })




    }
  },
  putlogin: function () {
    const that=this;
    if ((/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.data.mobile)) && (/[0-9]{4}/.test(that.data.smsvcode))) {
    wx.request({
      url: wx.getStorageSync('config').login_url,
      data:{
        mobile: that.data.mobile,
        smsvcode: that.data.smsvcode,
        platform: that.data.platform,
        openid: that.data.openid,
      },
    method: "post",
    header: wx.getStorageSync('header'),
    success(res){
      console.log()
      if (res.data.code == 200){
        // let token = res.data.data;
        wx.setStorageSync('token', res.data.data);//存储token
        let createTime = new Date();
        wx.setStorageSync('createTime', createTime);
        wx.redirectTo({
          url: '/pages/index/index',
        })
      } else if (res.data.code == 422){
        wx.showToast({
          title: '验证码错误',
          icon: 'error',
          duration: 2000
        })
      }else{
        let message = res.data.message    
        wx.showToast({
          title: message,
          icon: 'error',
          duration: 2000
        })
      }
    },
    fail() {
    }
      })
    } else if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.data.mobile))){
      wx.showToast({
        title: '手机号码错误!',
        icon: 'error',
        duration: 2000
      })

  }else{
      wx.showToast({
        title: '验证码有误!',
        icon: 'error',
        duration: 2000
      })

  }
    },
  inputvalue:function(e){
    this.setData({
      mobile: e.detail.value
    })   
  },
  checkinput: function (e) {
    this.setData({
      smsvcode: e.detail.value
    })
  },
  goagreement:function(){
    wx.redirectTo({
      url: '/pages/agreement/index',
    })
  },
  getcheck: function (e) {
    let that=this;
    var num = 60,timer;
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.data.mobile))) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'error',
        duration: 2000
      })
    } else{
      that.setData({
        codenum: num
      })
      wx.showToast({
        title: '获取验证码',
        icon: 'loading',
        duration: 6000
      })
       wx.request({
          url: wx.getStorageSync('config').send_url,
          method:'post',
          data:{
            type: 'login',
            mobile:that.data.mobile            
          },
         header: wx.getStorageSync('header'),
          success(res){
           timer=setInterval(function(){
             num--;
             if(num<=0){
               clearInterval(timer);
               that.setData({
                 codename:'重新发送',
                 disable:false,
               })
             }else{
               that.setData({
                 codename:num + 's',
                 disable:true
               })

             }
           }, 800)
          }
        })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    let openid = wx.getStorageSync('session').openid
    console.log(openid)
    if (typeof openid == "undefined" || openid == null || openid == ""){
      wx.login({
        success: res => {
          let code = res.code;
          wx.request({
            url: wx.getStorageSync('config').openid_url,
            data: { code: code },
            header: wx.getStorageSync('header'),
            success(res) {
              let session = res.data.data;
              console.log("登录页的openid")
              console.log(session)
              wx.setStorageSync('session', session);//信息存储openid和session
              that.setData({
                openid: session.openid
              })
              console.log("页面设置openid")
            },
            fail(res) {
              console.log(res)
              wx.showToast({
                title: '请重新进入!',
                icon: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    }else{
      console.log("app zhon")
      this.setData({
        openid: wx.getStorageSync('session').openid
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log("ddd")
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          that.setData({
            isHide: true
          });
        }
      }
    })

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