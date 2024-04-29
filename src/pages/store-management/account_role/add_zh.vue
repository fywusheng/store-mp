<!-- author by liushuag -->
<!-- date：2.15 -->
<template>
	<view class="main_content">
		<!-- 门店管理-新增账号-->
		<view class="role_content">
			<view class="title_text">新增账号</view>
			<view class="form">
				<view class="row flex_r_h">
					<view class="label">
						<text>*</text>
						姓名
					</view>
					<view class="right_input">
						<input placeholder="请输入店员真实姓名" placeholder-class="place_h"  v-model="accountParams.name"/>
						<view class="error_tip" v-if="valiteFlag && accountParams.name ==''">请输入店员真实姓名</view>
					</view>
				</view>
				<view class="row flex_r_h">
					<view class="label">
						<text>*</text>
						账号
					</view>
					<view class="right_input">
						<input placeholder="请输入账号（手机号）" placeholder-class="place_h" v-model="accountParams.accountPhone" type="number"/>
						<view class="error_tip"  v-if="valiteFlag && accountParams.accountPhone ==''">请输入账号（手机号）</view>
						<view class="error_tip"  v-if="valiteFlag && errorTip">手机号格式错误，请重新输入</view>
					</view>
				</view>
				<view class="row flex_r_h">
					<view class="label">
						<text>*</text>
						角色
					</view>
					<view class="right_input">
						<uni-data-picker :localdata="roleList" placeholder="请选择"  popup-title="请选择角色类型" @change="confirmSelectRole" v-model="accountParams.roleId" ></uni-data-picker>
						<view class="error_tip" v-if="valiteFlag && accountParams.roleId ==''">请选择角色类型</view> 
					</view>
				</view>
				<view class="row">
					<view class="label">
						账号说明
					</view>
					<view class="right_input">
						<textarea placeholder="您可在此填写账号说明" placeholder-class="place_h" v-model="accountParams.summary" maxlength="200"/>
					</view>
				</view>
			</view>
		</view>
		<view class="footer_btn flex_r_h">
			<view class="reset_btn" @click="resetInfo">重置</view>
			<view class="commit_btn" @click="commitValite">提交</view>
		</view>
		<!-- 新建编辑提示 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="info" cancelText="关闭" confirmText="确认" title=" " :content="type==='add'?'是否新建该账号？':'是否修改该账号？' " @confirm="querySaveRole"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>
<script>
	import api from '@/apis/index.js';
	import { validatePhoneNumber } from "@/utils/validation.js";
	export default {
		data() {
			return {
				selectRoleShow:false,
				show:false,
				type:'add',
				errorTip:false,
				accountParams:{
					summary:'',//描述
					roleId:'',//权限
					accountPhone:'',//账号
					name:'',//名称
					storeNo:uni.getStorageSync('storeNo')
				},
				roleList:[], //角色列表
				rolePemissonId:'', //权限显示
				valiteFlag:false,
				accountId:'',//用户账号id
			};
		},
		created() {

		},
		mounted() {
			
		},
		onLoad(option) {
			console.log("参数", option)
			this.queryRoleList();
			this.type = option?.type
			this.accountId = option?.accountId
			if(this.type === 'edit'){
				this.getAccountDetails(this.accountId)
			}
		},
		methods: {
			/**
			 * 请求账号详情
			 * @param {id} 用户账号id 
			 */
			getAccountDetails(id){
				api.getAccountDetails({
				  data: {
				   id:id 
				  },
				  success: (data) => {
					  console.log("详情",data)
					  this.accountParams = {...data}
				  },
				  fail: (err) => {
				    this.$uni.showToast(err.message);
				  },
				})
			},
			/**
			 * 角色选择 弹框控制 handleSelectRole
			 * 确认选择角色 confirmSelectRole
			 */
			handleSelectRole(){
				this.selectRoleShow = true
			},
			confirmSelectRole(e){
				console.log("333",e)
				// this.rolePemissonId = e[0].label
				this.accountParams.roleId = e.detail.value[0].value
			},
			/**
			 * 获取角色列表
			 */
			queryRoleList() {
			    let params = {
					queryObject:{
						name:'',
						storeNo:uni.getStorageSync('storeNo'),
					},
					pageNum:1,
					pageSize:100000
			    }
				api.getRoleList({
				  data: {
				   ...params
				  },
				  success: (data) => {
					  const { list , totalCount,totalPages  } = data
					  const newArray = list.map(role => {
					  	return { ...role, value: role.id,text:role.name };
					  });
					  const filteredArray = newArray.filter(item => item.value != 1);
					  this.roleList = filteredArray
				  },
				  fail: (err) => {
				    this.$uni.showToast(err.msg);
				  },
				})
			},
			/**
			 * 选择权限信息
			 */
			handlerSelectPer(e){
				this.rolePemissonId = e.detail.value;
				console.log(this.rolePemissonId)
			},
			/**
			 * 提交校验必填字段
			 * @param summary 描述
			 * @param name 名称
			 * @param roleId 角色类型
			 * @param accountPhone 账号
			 */
			commitValite(){
				this.valiteFlag = true
				if(this.accountParams.name === '' || this.accountParams.roleId === '' || this.accountParams.accountPhone === '') return ;
				if (!validatePhoneNumber(this.accountParams.accountPhone)) {this.errorTip= true ; return;} else {this.errorTip = false;}
				this.$refs.alertDialog.open()
			},
			/**
			 * 新增编辑角色
			 */
			querySaveRole() {
				api.saveUser({
				  data: {
				   ...this.accountParams
				  },
				  success: (data) => {
					  
					  if(this.type === 'add'){
					  	this.$uni.showToast("该账号新建成功！");
					  }else{
					  	this.$uni.showToast("该账号编辑成功！");
					  }
					  uni.redirectTo({
					  	url: '/pages/store-management/account_role/index?tab=2'
					  });
				  },
				  fail: (err) => {
					this.$uni.showToast(err.msg);
				  },
				})
			},
			/**
			 *重置信息
			 */
			resetInfo(){
				const clearedAccountParams = { ...this.accountParams, summary: '', roleId: '', accountPhone: '', name: '' };
				this.accountParams = clearedAccountParams
				this.rolePemissonId = '';
				this.valiteFlag = false;
				this.show = false;
			}
			

		},
		onShow() {

		},
		destroyed() {},
	};
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		height: 100%;
		/* #ifdef H5 */
		background-color: #fff;
		/* #endif */

	}
</style>
<style lang="scss">
	.flex_r_h{
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	.flex_c_h{
		display: flex;
		align-items: center;
		justify-content:center;
		flex-direction: column;
	}
	.slot-content{
		padding: 34rpx;
		text-align: center;
	}
	.main_content{
		.role_content{
			background: #fff;	
			margin-bottom: 16rpx;
			padding: 32rpx 30rpx;
		}
		.title_text{
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
		}
		.title_text::before{
			width: 6rpx;
			height: 24rpx;
			background: #FF5500;
			content: '';
			display: inline-block;
			margin-right: 12rpx;
		}
		.form{
			margin-top: 30rpx;
			.row{
				align-items: flex-start;
				justify-content: space-between;
				padding: 24rpx 0;
				border-bottom: 1rpx solid #eee;
			}
			.label{
				font-size: 28rpx;
				color: #333333;
				width: 130rpx;
				text{
					color: #FF3B30;
				}
			}
			.right_input{
				text-align: right;
				.select{
					justify-items: flex-end;
				}
				.icon{
					width: 24rpx;
					height: 24rpx;
				}
				input{
					color: #333;
				}
				.place_h{
					color: #CCCCCC;
				}
				.error_tip{
					color: #FF5500;
					margin-top: 24rpx;
				}
				textarea{
					width: 100%;
					text-align: left;
					margin-top: 28rpx;
					color: #333;
				}
			}
		}
		.footer_btn{
			margin-top: 80rpx;
			padding: 0 40rpx;
			justify-content: space-between;
			view{
				width: 300rpx;
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				border-radius: 200rpx;
				font-size: 32rpx;
				
			}
			.reset_btn{
				color: #FF5500;
				border: 1rpx solid #FF5500;
				background: #FFFFFF;
			}
			.commit_btn{
				background: linear-gradient(95deg, #FA7532 0%, #FF5500 100%);
				color: #fff;
			}
		}
	}
</style>
