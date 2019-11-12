var host ="http://api.bzffs.cc"
var config={
  host,
  login_url: host +'/api/auth/login',
  quick_login_url: host + '/api/auth/quick_login',
  refresh_url: host + '/api/auth/refresh',
  logout_url: host + '/api/auth/logout',
  info_url: host + '/api/auth/info',
  isregister_url: host + '/api/calling/isregister',  
  register_url: host + '/api/calling/register',
  calling_url: host + '/api/calling/save',
  list_url: host + '/api/order/list',
  detail_url: host + '/api/order/detail',
  order_url: host + '/api/order/save',
  cancel_url: host + '/api/order/cancel', 
  tracker_url: host + '/api/order/tracker',
  item_url: host + '/api/parameter/item',
  send_url: host + '/api/sms/send',   
  openid_url: host + '/api/wechat/mini_program/openid', 
  evaluate_url: host + '/api/order/evaluate',
  userinfo_url: host + '/api/wechat/mini_program/userinfo',
  senduser_url: host + '/api/sendorder/senduser',
  driverlist_url: host + '/api/driver/lists'
}
var header = { 'x-service-id': '1' }
module.exports = {config, header}