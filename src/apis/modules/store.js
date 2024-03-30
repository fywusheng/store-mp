import {
	request
} from '@/apis/request'

export default {
	/**
	 * 获取门店角色列表
	 */
	getRoleList: function(args = {}) {
		request({
			port: '0',
			url: '/srm/sh/role/listByPageNo',
			method: 'post',
			...args
		})
	},
	/**
	 * 新建 修改 删除角色
	 */
	saveRole: function(args = {}) {
		request({
			url: '/srm/sh/role/saveRole',
			method: 'post',
			...args
		})
	},
	/**
	 * 门店管理-用户账号列表
	 */
	getUserAccountList: function(args = {}) {
		request({
			url: '/srm/sh/user/listByPageNo',
			method: 'post',
			...args
		})
	},
	/**
	 * 新建 修改用户账号
	 */
	saveUser: function(args = {}) {
		request({
			url: '/srm/sh/user/saveUser',
			method: 'post',
			...args
		})
	},

	/**
	 * 获取权限列表
	 */
	getPermissonList: function(args = {}) {
		request({
			url: '/srm/sh/role/getPermissonList',
			method: 'post',
			...args
		})
	},
	/**
	 * 角色详情 
	 * @@param {id} 角色id 
	 */
	getRoleDetails: function(args = {}) {
		request({
			url: '/srm/sh/role/getRoleById',
			method: 'post',
			...args
		})
	},
	/**
	 * 账号详情 
	 * @param {id} 用户账号id 
	 */
	getAccountDetails: function(args = {}) {
		request({
			url: '/srm/sh/user/getUserById',
			method: 'post',
			...args
		})
	},
	/**
	 * 代客下单 - 代课登录
	 * @param {type}  
	 */
	customLogin: function(args = {}) {
		request({
			url: '/srm/sh/user/dk/loginByShMobile',
			method: 'post',
			...args
		})
	},
	/**
	 * 用户管理
	 * @param storeNo 是	string	门店编号
	 * @param memberType 是	string	用户类型 1 用户 2会员
	 * @param phone	否	string	手机号
	 * @param pageNum	否	string	页数
	 * @param pageSize
	 */
	getUserData: function(args = {}) {
		request({
			port: '1',
			url: '/member/memberInfoManage/getPageUserInfoList',
			method: 'post',
			...args
		})
	},
	/**
	 * 用户详情
	 * @param { member_id } id 
	 */
	getUserDataDetails: function(args = {}) {
		request({
			port: '2',
			url: '/nepsp-api/nun/api/userPerson/getUserInfoById',
			method: 'post',
			...args
		})
	},
	/**
	 * 客户订单管理
	 */
	getUserOrderList: function(args = {}) {
		request({
			port: '1',
			url: '/orderAgent/list',
			method: 'post',
			...args
		})
	},
	/**
	 * 客户订单详情
	 */
	getUserOrderDetails: function(args = {}) {
		request({
			port: '1',
			url: '/orderAgent/get',
			method: 'post',
			...args
		})
	},
	/**
	 * 登录发送验证码
	 */
	sendLoginSms: function(args = {}) {
		request({
			port: '2',
			url: '/nepsp-api/nun/api/sms/sendLoginSms',
			method: 'post',
			...args,
			header:{
					'channel': 'msg',
			}
		})
	},
	/**
	 * 登录
	 */
	login: function(args = {}) {
		request({
			port: '0',
			url: '/srm/sh/user/dk/verifyCodeAndLogin',
			method: 'post',
			...args
		})
	},
	/**
	 * 获取功能列表
	 */
	getFunctionList: function(args = {}) {
		request({
			url: '/srm/sh/user/getUserById',
			method: 'post',
			...args
		})
	},
	/**
	 * 门店首页数据统计
	 */
	getIndexCountByStore: function(args = {}) {
		request({
			port: '2',
			url: '/nepsp-api/offlineshopping/orderIndex/count/getIndexCountByStore',
			method: 'post',
			...args
		})
	},
	/**
	 * 门店详情接口 
	 * @param {id} 门店id  
	 */
	getStoreInfo: function(args = {}) {
		request({
			url: '/srm/sh/stores/getStoreById',
			method: 'post',
			...args
		})
	},
	/**
	 * 门店编辑
	 * 合作续签
	 */
	saveStores: function(args = {}) {
		request({
			url: '/srm/sh/stores/saveStores',
			method: 'post',
			...args
		})
	},
	/**
	 * 导出已完成/退款订单列表
	 */
	exportOrderInfo: function(args = {}) {
		request({
			port: '1',
			url: '/orderAgent/exportOrderInfo',
			method: 'post',
			common:true,
			...args
		})
	},
	/**
	 * 导出已完成/退款订单明细
	 */
	exportOrderDetail: function(args = {}) {
		request({
			port: '1',
			url: '/orderAgent/exportOrderDetail',
			method: 'post',
			...args,
			common:true
		})
	},
	/**
	 * 导出销售报表
	 */
	exportSaleExcel: function(args = {}) {
		request({
			port: '1',
			url: '/orderAgent/exportSaleExcel',
			method: 'post',
			...args,
			common:true,
		})
	},
	/**
	 * 导出对账报表
	 */
	exportReconciliation: function(args = {}) {
		request({
			port: '1',
			url: '/orderAgent/exportReconciliation',
			method: 'post',
			...args,
			common:true,
		})
	},
	/**
	 * 活动列表
	 */
	getActivityList: function(args = {}) {
		request({
			port: '1',
			url: '/marketing/promotion/activity/list',
			method: 'post',
			...args
		})
	},
	/**
	 * 活动详情
	 */
	getActivityDetails: function(args = {}) {
		request({
			port: '1',
			url: '/marketing/promotion/activity/loading',
			method: 'get',
			...args
		})
	},
	/**
	 * 可导出报表月份查询
	 * 
	 */
	selectOrderMonthByYea: function(args = {}) {
		request({
			port: '1',
			url: '/orderAgent/selectOrderMonthByYear',
			method: 'post',
			...args
		})
	},
}