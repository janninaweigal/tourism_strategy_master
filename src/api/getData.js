import fetch from '@/config/fetch'

//登陆
export const login = data => fetch('/admin/login', data, 'POST');
//退出
export const signout = () => fetch('/admin/signout');
// 上传图片
export const uploadImg = data => fetch('/uploadImg', data, 'POST');
// 修改密码
export const changePwd = data => fetch('/changePwd', data, 'POST');
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


// --------------------------------商品订单信息 start--------------------------------
// 获取商品订单列表
export const getGoodsOrderList = data => fetch('/goods/order/list', data, 'POST');
// --------------------------------end 商品订单信息--------------------------------

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
// 获取所有景点
export const getAllTouristSpot = data => fetch('/touristSpot/all', data, 'GET');
// 获取景点详情
export const getTouristSpotById = data => fetch('/touristSpot', data, 'GET');
// 添加景点
export const insertTouristSpot = data => fetch('/touristSpot/insert', data, 'POST');
// 修改景点
export const updateTouristSpot = data => fetch('/touristSpot/update', data, 'PUT');
// 删除景点
export const deleteTouristSpot = data => fetch('/touristSpot/delete', data, 'DELETE');
// --------------------------------end 旅游景点--------------------------------

// --------------------------------旅游景点门票 start--------------------------------
// 获取景点门票列表
export const getTouristSpotTicketList = data => fetch('/touristSpotTicket/list', data, 'POST');
// 获取景点门票预约人数
export const getAppointUsers = data => fetch('/touristSpotTicket/appointUsers', data, 'GET');
// 获取景点门票详情
export const getTouristSpotTicketById = data => fetch('/touristSpotTicket', data, 'GET');
// 添加景点门票
export const insertTouristSpotTicket = data => fetch('/touristSpotTicket/insert', data, 'POST');
// 修改景点门票
export const updateTouristSpotTicket = data => fetch('/touristSpotTicket/update', data, 'PUT');
// 删除景点门票
export const deleteTouristSpotTicket = data => fetch('/touristSpotTicket/delete', data, 'DELETE');
// --------------------------------end 旅游景点门票--------------------------------

// --------------------------------酒店 start--------------------------------
// 获取酒店列表
export const getHotelList = data => fetch('/hotel/list', data, 'POST');
// 获取酒店详情
export const getHotelById = data => fetch('/hotel', data, 'GET');
// 得到所有的Id和Name
export const getAllHotel = data => fetch('/hotels', data, 'GET');
// 添加酒店
export const insertHotel = data => fetch('/hotel/insert', data, 'POST');
// 修改酒店
export const updateHotel = data => fetch('/hotel/update', data, 'PUT');
// 删除酒店
export const deleteHotel = data => fetch('/hotel/delete', data, 'DELETE');
// --------------------------------end 酒店--------------------------------


// --------------------------------酒店房间 start--------------------------------
// 获取酒店房间列表
export const getRoomList = data => fetch('/room/list', data, 'POST');
// 获取酒店房间详情
export const getRoomById = data => fetch('/room', data, 'GET');
// 添加酒店房间
export const insertRoom = data => fetch('/room/insert', data, 'POST');
// 修改酒店房间
export const updateRoom = data => fetch('/room/update', data, 'PUT');
// 删除酒店房间
export const deleteRoom = data => fetch('/room/delete', data, 'DELETE');
// --------------------------------end 酒店房间--------------------------------

// --------------------------------社区服务 start--------------------------------
// 获取社区服务列表
export const getCommunityList = data => fetch('/community/list', data, 'POST');
// 获取社区服务详情
export const getCommunityById = data => fetch('/community', data, 'GET');
// 添加社区服务
export const insertCommunity = data => fetch('/community/insert', data, 'POST');
// 修改社区服务
export const updateCommunity = data => fetch('/community/update', data, 'PUT');
// 删除社区服务
export const deleteCommunity = data => fetch('/community/delete', data, 'DELETE');
// --------------------------------end 社区服务--------------------------------

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
