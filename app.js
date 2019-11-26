//app.js
var {config,header}=require("./config.js");
App({
  onLaunch: function () {
    // 展示本地存储能力
    wx.setStorageSync('config', config)
    wx.setStorageSync('header', header)
     let time = new Date();
     let createTime = wx.getStorageSync('createTime');
     let token = wx.getStorageSync('token');
     if(!token){
       wx.login({
         success:res=>{
           let code=res.code;
           wx.request({
             url: wx.getStorageSync('config').openid_url,
             data: { code: code },
             header: wx.getStorageSync('header'),
             success(res){
               let session = res.data.data;
               wx.setStorageSync('session', session);//信息存储openid和session
             },
             fail(res) {
               wx.showToast({
                 title: '请重新进入!',
                icon: 'error',
                 duration: 2000
               })
             }
           })
         }
       })

     } else if (time - createTime > 14 * 24 * 3600 * 1000){
       let token = wx.getStorageSync('token');
       wx.request({
         url: wx.getStorageSync('config').refresh_url,
         method:'post',
         data:{
           token: token.access_token
         },
         success(res){
           if(res.data.code==200){
             let token = res.data.data;
             wx.setStorageSync('token', token);//存储token
             let createTime = new Date();
             wx.setStorageSync('createTime', createTime);
           }
         }
       })

     }else{
       console.log("app中登录了，token有效")
     }


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    
  },
  globalData: {
    userInfo: null
  }
})