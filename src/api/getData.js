import fetch from '@/config/fetch'

//登陆
export const login = data => fetch('/admin/login', data, 'POST');
//退出
export const signout = () => fetch('/admin/signout');
// 上传图片
export const uploadImg = data => fetch('/uploadImg', data, 'POST');
// --------------------------------用户信息 start--------------------------------
//获取用户信息
export const getAdminInfo = () => fetch('/admin/info');
// 获取用户列表
export const getUserList = data => fetch('/user/list', data, 'POST');
// 添加用户
export const insertUser = data => fetch('/user/insert', data, 'POST');
// 修改用户
export const updateUser = data => fetch('/user/update', data, 'PUT');
// 删除用户
export const deleteUser = data => fetch('/user/delete', data, 'DELETE');
// --------------------------------end 用户信息--------------------------------

// --------------------------------商品信息 start--------------------------------
// 获取商品列表
export const getGoodsList = data => fetch('/goods/list', data, 'POST');
// 添加商品
export const insertGoods = data => fetch('/goods/insert', data, 'POST');
// 修改商品
export const updateGoods = data => fetch('/goods/update', data, 'PUT');
// 删除商品
export const deleteGoods = data => fetch('/goods/delete', data, 'DELETE');
// --------------------------------end 商品信息--------------------------------

// --------------------------------火车票信息 start--------------------------------
// 获取火车票列表
export const getTrainList = data => fetch('/train/list', data, 'POST');
// 获取火车票详情
export const getTrainById = data => fetch('/train', data, 'GET');
// 添加火车票
export const insertTrain = data => fetch('/train/insert', data, 'POST');
// 修改火车票
export const updateTrain = data => fetch('/train/update', data, 'PUT');
// 删除火车票
export const deleteTrain = data => fetch('/train/delete', data, 'DELETE');
// --------------------------------end 火车票信息--------------------------------


// --------------------------------攻略信息 start--------------------------------
// 获取攻略列表
export const getStrategyList = data => fetch('/strategy/list', data, 'POST');
// 获取攻略详情
export const getStrategyById = data => fetch('/strategy', data, 'GET');
// 添加攻略
export const insertStrategy = data => fetch('/strategy/insert', data, 'POST');
// 修改攻略
export const updateStrategy = data => fetch('/strategy/update', data, 'PUT');
// 删除攻略
export const deleteStrategy = data => fetch('/strategy/delete', data, 'DELETE');
// --------------------------------end 攻略信息--------------------------------

// --------------------------------旅游景点 start--------------------------------
// 获取景点列表
export const getTouristSpotList = data => fetch('/touristSpot/list', data, 'POST');
// 获取景点详情
export const getTouristSpotById = data => fetch('/touristSpot', data, 'GET');
// 添加景点
export const insertTouristSpot = data => fetch('/touristSpot/insert', data, 'POST');
// 修改景点
export const updateTouristSpot = data => fetch('/touristSpot/update', data, 'PUT');
// 删除景点
export const deleteTouristSpot = data => fetch('/touristSpot/delete', data, 'DELETE');
// --------------------------------end 旅游景点--------------------------------

// --------------------------------酒店 start--------------------------------
// 获取酒店列表
export const getHotelList = data => fetch('/hotel/list', data, 'POST');
// 获取酒店详情
export const getHotelById = data => fetch('/hotel', data, 'GET');
// 添加酒店
export const insertHotel = data => fetch('/hotel/insert', data, 'POST');
// 修改酒店
export const updateHotel = data => fetch('/hotel/update', data, 'PUT');
// 删除酒店
export const deleteHotel = data => fetch('/hotel/delete', data, 'DELETE');
// --------------------------------end 酒店--------------------------------

// --------------------------------统计 start--------------------------------
//用户注册量
export const userCount = date => fetch('/statis/user/' + date + '/count');
//某一天订单数量
export const orderCount = date => fetch('/statis/order/' + date + '/count');
//某一天管理员注册量
export const adminDayCount = date => fetch('/statis/admin/' + date + '/count');
//管理员数量
export const adminCount = () => fetch('/statis/admins/count');
//获取用户数量
export const getUserCount = data => fetch('/statis/users/count', data);
//获取订单数量
export const getOrderCount = data => fetch('/statis/orders/count', data);
// --------------------------------end 统计--------------------------------
